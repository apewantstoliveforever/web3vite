import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

//import selector to get username from redux
import { useSelector } from "react-redux";
import { RootState } from "../../auth/store";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function InputForm() {
  const [showSubmit, setShowSubmit] = useState(false)

  const username = useSelector((state: RootState) => state.auth.username);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      setShowSubmit(value.username.length > 1)
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's on your mind, {username}?</FormLabel>
              <FormControl>
                <Input placeholder="Input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSubmit && (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  )
}

export default InputForm
