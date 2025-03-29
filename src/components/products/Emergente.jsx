import {useRef, useEffect} from 'react'
import imagenEmergente1 from "../../assets/images/emergente/yuleLove.jpg";
import imagenEmergente2 from "../../assets/images/emergente/em2.jpg";
import imagenEmergente3 from "../../assets/images/emergente/em3.webp";
import imagenEmergente4 from "../../assets/images/emergente/em4.jpg";
import imagenEmergente5 from "../../assets/images/emergente/em5.webp";
import imagenEmergente6 from "../../assets/images/emergente/em6.webp";
import imagenEmergente7 from "../../assets/images/emergente/em7.webp";
import imagenEmergente8 from "../../assets/images/emergente/em8.webp";
import imagenEmergente9 from "../../assets/images/emergente/em9.webp";
import imagenEmergente10 from "../../assets/images/emergente/em10.webp";
import imagenEmergente11 from "../../assets/images/emergente/em11.webp";
import imagenEmergente12 from "../../assets/images/emergente/em12.webp";
const Emergente = ({ producto }) => {
  
const emergenteData = {
    1: { titulo: "Obtén", destacado: "Asesoría", subtitulo: "gratuita", imagen: imagenEmergente1 },
    2: { titulo: "Disfruta Nuestros", destacado: "Beneficios", subtitulo: "", imagen: imagenEmergente2 },
    3: { titulo: "Accede", destacado: "Ofertas", subtitulo: "Exclusivas", imagen: imagenEmergente3 },
    4: { titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4 },
    5: { titulo: "Ahorra", destacado: "", subtitulo: "en tu primera compra", imagen: imagenEmergente5 },
    6: { titulo: "Obtén", destacado: "Descuentos", subtitulo: "Especiales", imagen: imagenEmergente6 },
    7: { titulo: "Envío", destacado: "Gratis", subtitulo: "en todo Lima", imagen: imagenEmergente7 },
  };
  const dialogRef = useRef(null)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const data = emergenteData[id] || emergenteData[1];
    useEffect(() => {
        if (dialogRef.current) {
          dialogRef.current.showModal(); // Abre el modal automáticamente
        }
      }, []);

      const onClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close() // cierra el modal con onClick
        }
      }
  return (
    <dialog  ref={dialogRef} className="rounded-2xl fixed top-[50%] left-[50%] ml-[-200px] sm:ml-[-256px] mt-[-250px] sm:mt-[-225px]">
      <div className="flex flex-col-reverse sm:flex-row rounded-2xl shadow-lg max-w-[400px] sm:max-w-lg overflow-hidden sm:mx-[0px]">
        <div className="sm:w-1/2">
          <img src={data.imagen.src} alt={data.destacado} className="h-[250px] sm:h-full w-full object-cover" />
        </div>

        <div className="sm:w-1/2 bg-[#293296] p-6 text-white">
          <button onClick={onClose} className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center">
            ✕
          </button>

          {id == 1 && (
            <h2 className="text-xl sm:text-4xl font-semibold italic">
              Obtén
              <>
                <br />
                <span className="text-2xl sm:text-5xl font-bold">
                  Asesoría
                  <br />
                </span>
              </>
              gratuita
            </h2>
          )}
          {id == 2 && (
            <h2 className="text-xl sm:text-4xl font-bold italic">
              <span className="text-base sm:text-3xl font-semibold">
                Disfruta Nuestros
                <br />
              </span>
              Beneficios
            </h2>
          )}
          {id == 3 && (
            <h2 className="text-xl sm:text-4xl font-semibold italic">
              Accede
              <>
                <br />
                <span className="text-2xl sm:text-5xl font-bold">
                  Ofertas
                  <br />
                </span>
              </>
              Exclusivas
            </h2>
          )}
          {id == 4 && (
            <h2 className="text-base sm:text-2xl font-semibold italic">
              Gana <br />{" "}
              <span className="text-2xl sm:text-5xl font-semibold">10% dto.</span>{" "}
              en tu compra
            </h2>
          )}
          {/* {id == 5 && (
            <h2 className="text-base sm:text-2xl font-semibold italic">
              <span className="text-2xl sm:text-5xl font-semibold">
                Ahorra
                <br />
              </span>
              en tu primera compra
            </h2>
          )}
          {id == 6 && (
            <h2 className="text-lg sm:text-3xl font-semibold italic">
              Obtén
              <>
                <br />
                <span className="text-xl sm:text-4xl font-bold">
                  Descuentos
                  <br />
                </span>
              </>
              Especiales
            </h2>
          )}
          {id == 7 && (
            <h2 className="text-xl sm:text-4xl font-semibold italic">
              Envío
              <>
                <br />
                <span className="text-3xl sm:text-6xl font-bold">
                  Gratis
                  <br />
                </span>
                <span className="text-base sm:text-2xl font-semibold">
                  en todo Lima
                </span>
              </>
            </h2>
          )} */}


          <form className="mt-4">
            <label className="block text-lg font-bold">Nombre</label>
            <input type="text" className="w-full px-3 py-1 rounded-full bg-white text-black mb-4" />

            <label className="block text-lg font-bold">Teléfono</label>
            <input type="text" className="w-full px-3 py-1 rounded-full bg-white text-black mb-4" />

            <label className="block text-lg font-bold">Correo</label>
            <input type="email" className="w-full px-3 py-1 rounded-full bg-white text-black mb-4" />

            <button className="w-full bg-[#172649] text-white-800 text-2xl border py-3 rounded-lg font-bold">
              {id == 3 || id == 5 ? "Regístrate" : id == 4 || id == 6 ? "Cotiza ahora" : "Aprovecha ahora"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Emergente;
