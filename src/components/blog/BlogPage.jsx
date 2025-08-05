import { a } from "framer-motion/client";
import React from "react";

export default function BlogDetail({ article }) {
  const imageBaseUrl =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://127.0.0.1:8000"
      : "https://apiyuntas.yuntaspublicidad.com";

  return (
    <>
      {/* Imagen principal con encabezado */}
      <section className="relative">
        {article.imagen_principal ? (
          <img
            src={imageBaseUrl + article.imagen_principal}
            alt={article.nombre_producto || "Imagen principal del blog"}
            className="w-full max-h-[100vh] object-cover"
          />
        ) : article.imagenes?.length > 0 ? (
          <img
            src={imageBaseUrl + article.imagenes[0].ruta_imagen}
            alt={article.imagenes[0].texto_alt || "Imagen del blog"}
            className="w-full max-h-[100vh] object-cover"
          />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center bg-gray-200 text-gray-500">
            Sin imagen disponible
          </div>
        )}
      </section>


      {/* Título principal */}
      <div className="w-full bg-white text-blue-950 text-3xl font-extrabold text-center h-20 content-center">
        <h2 className="text-5xl">{article.nombre_producto}</h2>
      </div>

      {/* Contenido del blog */}
      <section className="p-24 text-white bg-gradient-to-b from-blue-900 to-indigo-950 flex flex-col">
        <div className="Montserrat relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header animado */}
          <div className="text-center mb-16 animate-fade-in">
           <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-float">
            {article.subtitulo || "Descubre nuestro blog"}
          </h1>

          </div>

          {/* Secciones dinámicas */}
          <div className="space-y-12 mb-16">
            {article.parrafos?.map((p, index) => {
              const image = article.imagenes?.[index % article.imagenes.length]; // Repetir si hay más párrafos que imágenes
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-8 lg:gap-12 p-6 lg:p-8 rounded-3xl hover:scale-105 hover:shadow-2xl group cursor-pointer`}
                >
                  {image && (
                    <div className="flex-none w-full lg:w-80 h-48 lg:h-56 order-1 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-cyan-500/30">
                      <img
                        src={imageBaseUrl + image.ruta_imagen}
                        alt={image.texto_alt || "Imagen del blog"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 order-2">
                    <p className="text-lg leading-relaxed text-white/90 text-justify">
                      {p.parrafo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA final */}
          <div className="text-center animate-fade-in">
            <p className="text-xl lg:text-2xl mb-8 text-white/90 font-medium">
              ¿Quieres saber más?
            </p>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 animate-glow group relative overflow-hidden"
            >
              <span className="relative z-10">Contáctanos</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
