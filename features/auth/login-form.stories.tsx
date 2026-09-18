import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor } from "storybook/test";

import { LoginForm, type LoginFormProps } from "./login-form";

const meta = {
  title: "Auth/LoginForm",
  component: LoginForm,
  args: {
    action: fn<LoginFormProps["action"]>(async () => ({ ok: true, data: undefined })),
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[560px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SubmitsDemoCredentials: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    await waitFor(() =>
      expect(args.action).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "Admin123!",
      }),
    );
  },
};

export const ShowsValidationErrors: Story = {
  args: {
    defaultValues: { email: "", password: "" },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Email"), "anna@stopka");
    await userEvent.type(canvas.getByLabelText("Пароль"), "123");
    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    await expect(
      await canvas.findByText("Введите адрес целиком, например name@company.ru"),
    ).toBeVisible();
    await expect(canvas.getByText("Не короче 8 символов")).toBeVisible();
    await expect(canvas.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    await expect(args.action).not.toHaveBeenCalled();
  },
};

export const ShowsServerError: Story = {
  args: {
    action: fn<LoginFormProps["action"]>(async () => ({
      ok: false,
      error: "Неверный email или пароль",
    })),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Войти" }));

    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveTextContent("Неверный email или пароль");
    await expect(args.action).toHaveBeenCalledOnce();
  },
};

export const TogglesPasswordVisibility: Story = {
  play: async ({ canvas, userEvent }) => {
    const password = canvas.getByLabelText("Пароль");
    await expect(password).toHaveAttribute("type", "password");

    await userEvent.click(canvas.getByRole("button", { name: "Показать" }));
    await expect(password).toHaveAttribute("type", "text");

    await userEvent.click(canvas.getByRole("button", { name: "Скрыть" }));
    await expect(password).toHaveAttribute("type", "password");
  },
};
