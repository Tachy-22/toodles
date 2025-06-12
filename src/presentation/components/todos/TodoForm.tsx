import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with validation
const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Todo cannot be empty" })
    .max(100, { message: "Todo is too long" }),
});

type FormValues = z.infer<typeof formSchema>;

interface TodoFormProps {
  onSubmit: (title: string) => void;
  initialValue?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialValue = "",
  isEditing = false,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValue,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values.title);
    if (!isEditing) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <Input
                  placeholder={isEditing ? "Edit todo..." : "Add a new todo..."}
                  {...field}
                  className="flex-1"
                />
                <Button color="red" type="submit">
                  {isEditing ? "Update" : "Add"}
                </Button>
                {isEditing && onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
