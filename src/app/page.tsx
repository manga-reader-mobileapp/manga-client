"use client";
import { authLogin } from "@/api/login/auth";
import { useStore } from "@/store/useStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createAccount } from "@/api/login/createAccount";

export default function FormsLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [emailCreate, setEmailCreate] = useState("");
  const [nameCreate, setNameCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // const [recovery, setRecovery] = useState({
  //   isOpen: false,
  //   email: "",
  // });

  const { push } = useRouter();

  const login = async (e: any) => {
    e.preventDefault();

    if (email.length < 5) {
      toast.error("Preencha seu email");
      return;
    }

    if (password.length < 4) {
      toast.error("Preencha sua senha");
      return;
    }

    setIsLoading(true);

    const response = await authLogin(email, password);

    if (!response.acess_token) {
      setIsLoading(false);

      if (response.message === "") {
        toast.error("Verifique suas credenciais.");

        return;
      }
      toast.error(response.message);

      return;
    }

    useStore.setState({
      user: {
        email: response.user.email,
        name: response.user.name,
        id: response.user.id,
        created_at: response.user.created_at,
      },
    });

    push("/reader/library");
  };

  const handleCreateAccount = async (e: any) => {
    e.preventDefault();

    if (emailCreate.length < 5) {
      toast.error("Preencha seu email");
      return;
    }

    if (passwordCreate.length < 4) {
      toast.error("Preencha sua senha");
      return;
    }

    setIsLoading(true);

    const response = await createAccount(
      emailCreate,
      passwordCreate,
      nameCreate
    );

    setIsLoading(false);
    if (!response) {
      toast.error("Erro ao criar conta");
      return;
    }

    setIsCreateAccount(false);
    setEmailCreate("");
    setPasswordCreate("");
    setNameCreate("");

    toast.success(
      "Conta criada com sucesso, aguarde a aprovação de um moderador."
    );
  };

  return (
    <div className="bg-neutral-900 h-dvh w-full flex flex-col items-center justify-center gap-5">
      {!isCreateAccount ? (
        <form
          className="flex flex-col items-center max-w-96 w-full px-4 gap-5"
          onSubmit={login}
        >
          <h1 className="text-white text-left font-bold text-4xl w-full">
            Login
          </h1>
          <p className="text-white text-left w-full">
            Bem vindo de volta, acesse ou crie sua conta.
          </p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <p className="text-white">Email</p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-white"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <p className="text-white">Senha</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-white"
            />
          </div>

          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            Entrar
          </Button>

          <div
            className="w-full flex justify-end pr-2 text-blue-500 cursor-pointer"
            onClick={() => {
              setIsCreateAccount(true);
              setEmail("");
              setPassword("");
            }}
          >
            Não tem conta?
          </div>
        </form>
      ) : (
        <form
          className="flex flex-col items-center max-w-96 w-full px-4 gap-5"
          onSubmit={handleCreateAccount}
        >
          <h1 className="text-white text-left font-bold text-4xl w-full">
            Registro
          </h1>
          <p className="text-white text-left w-full">
            Crie sua conta para acessar o app.
          </p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <p className="text-white">Email</p>
            <Input
              type="email"
              className="text-white"
              value={emailCreate}
              onChange={(e) => setEmailCreate(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <p className="text-white">Nome</p>
            <Input
              type="text"
              className="text-white"
              value={nameCreate}
              onChange={(e) => setNameCreate(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <p className="text-white">Senha</p>
            <Input
              type="password"
              className="text-white"
              value={passwordCreate}
              onChange={(e) => setPasswordCreate(e.target.value)}
            />
          </div>

          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            Criar conta
          </Button>

          <div
            className="w-full flex justify-end pr-2 text-blue-500 cursor-pointer"
            onClick={() => {
              setIsCreateAccount(false);
              setEmailCreate("");
              setNameCreate("");

              setPasswordCreate("");
            }}
          >
            Já tem conta?
          </div>
        </form>
      )}

      {/* <div className="w-full flex justify-end pr-2">
        <Popover
          placement="bottom"
          showArrow
          offset={10}
          isOpen={recovery.isOpen}
          onOpenChange={(open) =>
            setRecovery((prev) => {
              return {
                ...prev,
                isOpen: open,
              };
            })
          }
        >
          <PopoverTrigger>
            <Link className="text-primary cursor-pointer" size="sm">
              Esqueceu a senha?
            </Link>
          </PopoverTrigger>
          <PopoverContent className="w-[240px]">
            <div className="px-1 py-2 w-full">
              <p className="text-small font-bold text-foreground">
                Insira seu email
              </p>
              <form
                action={async () => {
                  if (checkEmail(recovery.email)) {
                    setRecovery({
                      isOpen: false,
                      email: "",
                    });

                    await recover(recovery.email);

                    toast.success(
                      `E-mail enviado para você! clique no link recebido para recuperar.`,
                      {
                        position: "bottom-center",
                      }
                    );
                    return;
                  }

                  toast.error(`Insira um email válido.`, {
                    position: "bottom-center",
                  });
                }}
                className="mt-2 flex flex-col gap-2 w-full"
              >
                <Input
                  type="email"
                  required
                  size="sm"
                  label="Email"
                  radius="lg"
                  classNames={{
                    inputWrapper: "shadow-none",
                  }}
                  value={recovery.email}
                  onChange={(e) =>
                    setRecovery({
                      ...recovery,
                      email: e.target.value,
                    })
                  }
                />
                <div className="flex gap-1 w-full justify-between">
                  <Button
                    fullWidth
                    color="danger"
                    size="sm"
                    variant="flat"
                    radius="lg"
                    onPress={() => {
                      setRecovery({
                        isOpen: false,
                        email: "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    size="sm"
                    radius="lg"
                    type="submit"
                  >
                    Recuperar
                  </Button>
                </div>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div> */}
    </div>
  );
}
