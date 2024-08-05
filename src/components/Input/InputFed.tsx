import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSelector } from "react-redux";
import { RootState } from "../../auth/store";
import { db, user } from "../../services/gun";

const FormSchema = z.object({
  status: z.string().min(2, {
    message: "Status must be at least 2 characters.",
  }),
});

export function InputForm({
  setShowEditStatus,
}: {
  setShowEditStatus: (showEditStatus: boolean) => void;
}) {
  const [showSubmit, setShowSubmit] = useState(false);
  const [submittedText, setSubmittedText] = useState("");

  const username = useSelector((state: RootState) => state.auth.username);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.status !== undefined) {
        setShowSubmit(value.status.length > 2);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmittedText(data.status);
    user.get("profile").put({
      status: data.status,
    });
    setShowEditStatus(false);
    setShowSubmit(false);
    form.reset();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Input your status..."
                    className="resize-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showSubmit && (
            <div className="mt-4 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

export default InputForm;
