import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
      const data = await res.json();

      const details = await Promise.all(
        data.results.map((poke: any) =>
          fetch(poke.url).then((res) => res.json())
        )
      );

      setPokemon(details);
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: any = {
      fire: "#f08030",
      water: "#6890f0",
      grass: "#78c850",
      electric: "#f8d030",
      psychic: "#f85888",
      ice: "#98d8d8",
      dragon: "#7038f8",
      dark: "#705848",
      fairy: "#ee99ac",
      normal: "#a8a878",
      fighting: "#c03028",
      flying: "#a890f0",
      poison: "#a040a0",
      ground: "#e0c068",
      rock: "#b8a038",
      bug: "#a8b820",
      ghost: "#705898",
      steel: "#b8b8d0",
    };

    return colors[type] || "#ccc";
  };

  return (
    <>
      <div className="container">
        <h1>Pokédex</h1>

        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />

        <div className="grid">
          {filteredPokemon.map((poke) => (
            <div
              className="card"
              key={poke.id}
              onClick={() => setSelectedPokemon(poke)}
              style={{
                backgroundColor: getTypeColor(
                  poke.types[0].type.name
                ),
              }}
            >
              <img
                src={poke.sprites.front_default}
                alt={poke.name}
              />
              <p>{poke.name}</p>
              <p className="type">
                {poke.types
                  .map((t: any) => t.type.name)
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MODAL FUERA DEL CONTAINER (IMPORTANTE) */}
      {selectedPokemon && (
        <div
          className="modal"
          onClick={() => setSelectedPokemon(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedPokemon.name}</h2>

            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
            />

            <p><strong>ID:</strong> {selectedPokemon.id}</p>
            <p><strong>Altura:</strong> {selectedPokemon.height}</p>
            <p><strong>Peso:</strong> {selectedPokemon.weight}</p>

            <p>
              <strong>Tipos:</strong>{" "}
              {selectedPokemon.types
                .map((t: any) => t.type.name)
                .join(", ")}
            </p>

            <button onClick={() => setSelectedPokemon(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;