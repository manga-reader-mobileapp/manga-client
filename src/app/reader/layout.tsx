import Authenticated from "@/components/container/authenticate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Authenticated>{children}</Authenticated>;
}
