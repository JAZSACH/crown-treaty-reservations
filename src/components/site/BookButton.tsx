import { Button, type ButtonProps } from "@/components/ui/button";
import { useBooking } from "@/components/reservation/BookingProvider";

export function BookButton({ children = "Book a table", ...props }: ButtonProps) {
  const { open } = useBooking();
  return (
    <Button onClick={open} {...props}>
      {children}
    </Button>
  );
}
