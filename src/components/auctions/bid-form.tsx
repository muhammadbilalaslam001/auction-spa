import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Auction } from "@/types";
import { useBids } from "@/hooks/useBids";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "../../utils/format";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

interface BidFormProps {
  auction: Auction;
  highestBid: number;
}

const BidForm = ({ auction, highestBid }: BidFormProps) => {
  const { user } = useAuth();
  const { createBid, isCreatingBid } = useBids();
  const minimumBid = Math.max(highestBid, auction.startPrice) + 10; 

  const formSchema = z.object({
    amount: z.coerce
      .number()
      .positive("Bid amount must be positive")
      .min(minimumBid, `Bid must be at least ${formatCurrency(minimumBid)}`),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minimumBid,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast("Please sign in to place a bid");
      return;
    }

    try {
      await createBid({
        auctionId: auction.id,
        amount: data.amount,
      });

      toast(`Your bid of ${formatCurrency(data.amount)} was successful!`);

      // Reset the form with the new minimum bid
      form.reset({
        amount: data.amount + 10,
      });
    } catch (error: any) {
      toast("There was an error placing your bid");
    }
  };

  // Check if this is the user's own auction
  const isOwnAuction = user && auction.userId === user.id;

  // Check if auction is active
  const isActive = auction.status === "ACTIVE";

  if (!isActive) {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">Bidding Unavailable</h3>
        <p className="text-sm text-gray-500 mt-1">
          This auction is not currently active.
        </p>
      </div>
    );
  }

  if (isOwnAuction) {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">Your Auction</h3>
        <p className="text-sm text-gray-500 mt-1">
          You cannot bid on your own auction.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">Authentication Required</h3>
        <p className="text-sm text-gray-500 mt-1">
          Please sign in to place a bid.
        </p>
        <Button asChild className="mt-2 w-full">
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-900">Place your bid</h3>
      <p className="text-sm text-gray-500 mt-1">
        Minimum bid: {formatCurrency(minimumBid)}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    $
                  </span>
                  <FormControl>
                    <Input
                      type="number"
                      min={minimumBid}
                      step="1"
                      className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-3 w-full"
            disabled={isCreatingBid}
          >
            {isCreatingBid ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Bid"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-3 text-xs text-gray-500">
        By placing a bid, you agree to our <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Auction Rules</a>
      </div>
    </div>
  );
};

export default BidForm;
