import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout so /guia and /guia/$slug share a path. Pages render in the outlet. */
export const Route = createFileRoute("/guia")({
  component: () => <Outlet />,
});
