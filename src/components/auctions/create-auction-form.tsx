import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuctions } from '../../hooks/useAuctions';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Validation schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startPrice: z.coerce.number().positive('Starting price must be positive'),
  endDate: z.string().refine(
    val => {
      const date = new Date(val);
      const now = new Date();
      return date > now;
    },
    { message: 'End date must be in the future' }
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateAuctionFormProps {
  onSuccess?: () => void;
}

const CreateAuctionForm = ({ onSuccess }: CreateAuctionFormProps) => {
  const { createAuction, isCreating } = useAuctions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startPrice: 1,
      endDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // Default to 7 days from now
        return date.toISOString().slice(0, 16); // Format to YYYY-MM-DDThh:mm
      })(),
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createAuction({
        ...data,
        endDate: new Date(data.endDate),
      });

      toast('Your auction has been created successfully');

      form.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast('Failed to create auction. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter auction title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the item in detail"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0.01" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Auction'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAuctionForm;
