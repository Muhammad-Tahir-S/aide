import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Separator,
  Typography,
} from "@/shared/design-system";

const demoSchema = z.object({
  email: z.email(),
});

export default function CatalogPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof demoSchema>>({
    resolver: zodResolver(demoSchema),
    defaultValues: { email: "" },
  });

  return (
    <div className="flex w-full flex-col gap-12 p-6 md:px-10 md:py-8">
      <header className="flex max-w-xl flex-col gap-2">
        <p className="text-[12px] font-medium tracking-wide text-secondary-main uppercase">
          Development only
        </p>
        <Typography variant="display-sm/semibold" className="font-serif">
          Design system
        </Typography>
        <Typography variant="text-md/regular" className="text-gray-500">
          Owned primitives for this app. Add new UI here first, then use it in
          product screens. This route is not registered in production.
        </Typography>
      </header>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="font-serif text-[20px] text-gray-800">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="pryOutline">Outline</Button>
          <Button variant="grey">Grey</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="error">Error</Button>
        </div>
      </section>

      <Separator />

      <section className="flex max-w-md flex-col gap-4">
        <h2 className="font-serif text-[20px] text-gray-800">Input</h2>
        <Input placeholder="Email address" />
        <Input placeholder="With helper" helperText="Use your work email" />
      </section>

      <Separator />

      <section className="flex max-w-md flex-col gap-4">
        <h2 className="font-serif text-[20px] text-gray-800">Form</h2>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(() => undefined)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Validate</Button>
          </form>
        </Form>
      </section>

      <Separator />

      <section className="flex max-w-md flex-col gap-4">
        <h2 className="font-serif text-[20px] text-gray-800">Dialog</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="pryOutline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Example dialog</DialogTitle>
              <DialogDescription>
                Focus trap, overlay, and close control come from Radix. Styling
                is ours.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="grey"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
