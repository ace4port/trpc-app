import { getServerSession } from "next-auth";
import Providers from "../../utils/Providers";
import { authOptions } from "auth";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);

  if (session?.user) redirect("/dashboard");

  // @ts-ignore
  return <Providers>{children}</Providers>;
}
