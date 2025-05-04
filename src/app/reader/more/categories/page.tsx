"use client";

import { createCategory } from "@/api/category/create";
import { deleteCategory } from "@/api/category/delete";
import { getListCategory } from "@/api/category/getAll";
import { updateNameCategory } from "@/api/category/updateName";
import { updateOrderCategory } from "@/api/category/updateOrder";
import Popup from "@/components/popup/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/type/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { MdLabelOutline } from "react-icons/md";
import { toast } from "sonner";

const generateRandomHex = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function Categories() {
  const { push } = useRouter();
  const [categories, setCategories] = useState<(Category & { hex: string })[]>(
    []
  );

  const [editName, setEditName] = useState({
    id: "",
    name: "",
  });

  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getListCategory();
      if (response) {
        const sorted = response
          .sort((a: Category, b: Category) => a.orderKanban - b.orderKanban)
          .map((cat: Category) => ({
            ...cat,
            hex: generateRandomHex(),
          }));
        setCategories(sorted);
      }
    };
    fetchCategories();
  }, []);

  const moveCategory = async (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    // Troca os elementos de lugar
    [newCategories[index], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[index],
    ];

    // Atualiza a orderKanban somente dos envolvidos
    const updated1 = { ...newCategories[index], orderKanban: index };
    const updated2 = {
      ...newCategories[targetIndex],
      orderKanban: targetIndex,
    };

    const updated = [...newCategories];
    updated[index] = updated1;
    updated[targetIndex] = updated2;

    setCategories(updated);

    const response = await updateOrderCategory([
      { id: updated1.id, newPosition: updated1.orderKanban },
      { id: updated2.id, newPosition: updated2.orderKanban },
    ]);

    if (!response) {
      toast.error(
        `Erro ao atualizar a etapa ${updated1.name} para a posição ${updated1.orderKanban}`
      );
      return;
    }
  };

  const updateName = async (id: string, name: string) => {
    setIsLoadingEdit(true);
    const response = await updateNameCategory(id, name);

    if (response) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
      );
    }

    setIsLoadingEdit(false);
    return response;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-900 text-white w-full relative">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center gap-4 shrink-0">
        <button
          className="text-white text-2xl cursor-pointer"
          onClick={() => push(`/reader/more`)}
        >
          <IoIosArrowDropleftCircle />
        </button>

        <h1 className="text-2xl">Editar categorias</h1>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-4 px-4 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 h-full overflow-auto pb-24">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="bg-neutral-800 rounded-lg px-4 py-3 flex justify-between items-end"
          >
            <div className="flex flex-col gap-7">
              <div className="flex items-center gap-3">
                <MdLabelOutline size={20} style={{ color: category.hex }} />
                <span>{category.name}</span>
              </div>

              <div className="flex gap-5 items-center">
                <button onClick={() => moveCategory(index, "up")}>
                  <FaChevronUp />
                </button>
                <button onClick={() => moveCategory(index, "down")}>
                  <FaChevronDown />
                </button>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <button>
                <FiEdit
                  onClick={() => {
                    setEditName({ id: category.id, name: category.name });
                    setIsOpen(true);
                  }}
                  className="cursor-pointer"
                />
              </button>
              <button>
                <FiTrash
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    toast.custom(
                      (t) => (
                        <div className="p-4 bg-[var(--normal-bg)] border border-[var(--normal-border)] text-[var(--normal-text)] rounded-[var(--border-radius)] shadow-md w-[var(--width)] flex items-center gap-3">
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-default-500">
                              Tem certeza? Não será possível recuperar.
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant="destructive"
                              onClick={() => toast.dismiss(t)}
                              className="cursor-pointer"
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="default"
                              className="cursor-pointer"
                              onClick={async () => {
                                const response = await deleteCategory(
                                  category.id
                                );

                                toast.dismiss(t);

                                if (!response) {
                                  toast.error(
                                    "Erro ao criar categoria, verifiquei se possui mangas vinculados."
                                  );

                                  return;
                                }

                                setCategories((prev) =>
                                  prev.filter((cat) => cat.id !== category.id)
                                );
                              }}
                            >
                              Deletar
                            </Button>
                          </div>
                        </div>
                      ),
                      {
                        position: "bottom-left",
                      }
                    );
                  }}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão flutuante */}
      <button
        onClick={async () => {
          setIsLoadingCreate(true);
          const response = await createCategory();

          if (response) {
            setCategories((prev) => [
              ...prev,
              { ...response, hex: generateRandomHex() },
            ]);
          }
          setIsLoadingCreate(false);
        }}
        className="fixed bottom-5 right-5 bg-violet-500 hover:bg-violet-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
        disabled={isLoadingCreate}
      >
        <Plus size={20} />
        {isLoadingCreate ? "Criando..." : "Criar nova categoria"}
      </button>

      {/* Popup  */}
      <Popup
        isOpen={isOpen}
        onClose={() => {
          setEditName({ id: "", name: "" });
          setIsOpen(false);
        }}
      >
        <>
          <Input
            placeholder="Novo nome da categoria"
            value={editName.name}
            onChange={(e) => setEditName({ ...editName, name: e.target.value })}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const response = await updateName(editName.id, editName.name);

                if (!response) {
                  toast.error("Erro ao atualizar nome da categoria");
                  return;
                }

                setEditName({ id: "", name: "" });
                setIsOpen(false);
                return;
              }
            }}
          />

          <div className="flex gap-2 mt-4 justify-end">
            <Button
              variant="destructive"
              onClick={() => {
                setEditName({ id: "", name: "" });
                setIsOpen(false);
              }}
              className="cursor-pointer"
              disabled={isLoadingEdit}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                const response = updateName(editName.id, editName.name);

                if (!response) {
                  toast.error("Erro ao atualizar nome da categoria");
                  return;
                }

                setEditName({ id: "", name: "" });
                setIsOpen(false);
              }}
              className="cursor-pointer"
              disabled={isLoadingEdit}
            >
              Salvar
            </Button>
          </div>
        </>
      </Popup>
    </div>
  );
}
