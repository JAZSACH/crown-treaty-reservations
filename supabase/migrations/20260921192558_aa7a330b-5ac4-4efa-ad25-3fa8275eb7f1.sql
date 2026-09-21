-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Reservations
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'declined', 'cancelled');

CREATE SEQUENCE public.reservation_ref_seq START 10001;

CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_reference text NOT NULL UNIQUE DEFAULT ('CT-' || nextval('public.reservation_ref_seq')::text),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  number_of_guests integer NOT NULL CHECK (number_of_guests BETWEEN 1 AND 40),
  special_requests text,
  status public.reservation_status NOT NULL DEFAULT 'pending',
  confirmation_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  declined_at timestamptz,
  cancelled_at timestamptz
);
GRANT SELECT ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
-- No anon access at all. Admins may read; all writes go through server code (service role).
CREATE POLICY "Admins can view reservations" ON public.reservations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX reservations_date_idx ON public.reservations (reservation_date, reservation_time);
CREATE INDEX reservations_status_idx ON public.reservations (status);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();