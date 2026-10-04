import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReservationForm } from "./ReservationForm";
import { BigPartyForm } from "./BigPartyForm";
import { PartyChoice, type PartyMode } from "./PartyChoice";
import { PUB } from "@/content/pub";

const BookingContext = createContext<{ open: () => void }>({ open: () => {} });

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PartyMode | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setMode(null);
  };

  return (
    <BookingContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader className="text-left">
            <p className="eyebrow">Reservations</p>
            <DialogTitle className="text-3xl font-normal">
              {mode === "big" ? "Big party enquiry" : "Book a table"}
            </DialogTitle>
            <DialogDescription>
              {mode === "big"
                ? `Tell us about your event at ${PUB.name} and we'll be in touch.`
                : `Tell us when you'd like to visit ${PUB.name}. We'll confirm by email.`}
            </DialogDescription>
          </DialogHeader>
          {mode === null ? (
            <PartyChoice onChoose={setMode} />
          ) : mode === "small" ? (
            <>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="mb-4 text-sm font-semibold text-primary hover:underline"
              >
                ← Back to party size
              </button>
              <ReservationForm />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="mb-4 text-sm font-semibold text-primary hover:underline"
              >
                ← Back to party size
              </button>
              <BigPartyForm />
            </>
          )}
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
