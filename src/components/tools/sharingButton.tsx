import { FiShare2 } from "react-icons/fi";
import { toast } from "sonner";

const ShareButton = () => {
  const handleShare = async () => {
    const shareData = {
      title: "Título do conteúdo",
      text: "Confira este conteúdo interessante!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Compartilhado com sucesso");
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      // fallback para desktop
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copiado para a área de transferência!");
      } catch (err) {
        toast("Seu navegador não suporta compartilhamento.");

        console.log("Erro ao copiar link:", err);
      }
    }
  };

  return (
    <button onClick={handleShare} className="text-white text-xl cursor-pointer">
      <FiShare2 />
    </button>
  );
};

export default ShareButton;
