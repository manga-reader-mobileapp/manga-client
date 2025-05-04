"use client";

import { getAllHistory } from "@/api/history/getHistory";
import BottomMenu from "@/components/menu/bottomMenu";
import { HistoryGroup } from "@/type/types";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryGroup[]>([]);

  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const response = await getAllHistory();

      setIsLoading(false);

      if (response) {
        setHistoryData(response);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-900 text-white w-full ">
      {/* Header fixo */}
      <div className="py-4 px-5 flex items-center justify-between shrink-0 bg-[#140B1C]">
        <h1 className="text-2xl">Histórico</h1>
      </div>

      {!isLoading && !!historyData[0] && (
        <div className="flex-1 overflow-auto w-full px-5 pt-4">
          {historyData.map((group, index) => (
            <div key={index} className="mb-6 w-full">
              {/* Date Header */}
              <div className="">
                <h2 className="text-xl">{group.date}</h2>
              </div>

              {/* Manga Entries */}
              {group.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border-b border-gray-800 mx-4"
                >
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => {
                      push(`/reader/library/read/${entry.manga.id}`);
                    }}
                  >
                    <div className="relative h-24 w-16 rounded overflow-hidden">
                      <img
                        src={entry.manga.img}
                        alt={entry.manga.title}
                        className="rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {entry.manga.title}
                      </h3>
                      <p className="text-gray-400">
                        Cap. {entry.chapter} - {entry.time}
                      </p>
                    </div>
                  </div>
                  {/* <button
                    // onClick={() => handleDelete(entry.id)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button> */}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-400">Carregando...</p>
        </div>
      )}

      {/* BottomMenu fixo */}
      <BottomMenu />
    </div>
  );
}
