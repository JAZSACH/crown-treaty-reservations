import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReservationForm } from "./ReservationForm";
import { PUB } from "@/content/pub";

const BookingContext = createContext<{ open: () => void }>({ open: () => {} });

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <BookingContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader className="text-left">
            <p className="eyebrow">Reservations</p>
            <DialogTitle className="text-3xl font-normal">Book a table</DialogTitle>
            <DialogDescription>
              Tell us when you'd like to visit {PUB.name}. We'll confirm by email.
            </DialogDescription>
          </DialogHeader>
          <ReservationForm />
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
