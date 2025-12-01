// components/CharacterTable.tsx

'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { InstructionsTable } from '../components/Instructions/Instructions';

interface Character {
  id: string;
  name: string;
  house: string;
  dateOfBirth: string;
  actor: string;
  image: string;
}

const shuffleArray = (array: Character[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CharacterTable: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await fetch(
        'https://hp-api.onrender.com/api/characters'
      );
      const data = await response.json();
      const topTenCharacters = data.slice(0, 10);
      setCharacters(shuffleArray(topTenCharacters));
    };

    fetchCharacters();
  }, []);

  // Função para criar IDs válidos
  const generateId = (name: string) => {
    return name.replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div
      id="characterTableContainer"
      className="min-h-screen bg-gray-800 pt-2 px-4 sm:px-6 lg:px-8"
    >
      <InstructionsTable />
      <div id="characterList" className="max-w-5xl mx-auto mt-6 mb-6">
        <div id="characterCardsMobile" className="block sm:hidden">
          {characters.map((character) => {
            const id = generateId(character.name);
            return (
              <div
                key={character.id}
                id={`characterCard-${id}`}
                className="bg-gray-800 text-gray-100 mb-4 p-4 rounded-lg shadow-md flex flex-col items-center border"
              >
                <div className="w-24 h-24 relative mb-4">
                  <Image
                    src={character.image}
                    alt={character.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <p id={`characterName-${id}`} className="font-bold text-lg">
                  {character.name}
                </p>
                <p id={`characterHouse-${id}`}>{character.house}</p>
                <p id={`characterDateOfBirth-${id}`}>
                  {character.dateOfBirth || 'Unknown'}
                </p>
                <p id={`characterActor-${id}`}>{character.actor}</p>
              </div>
            );
          })}
        </div>
        <div id="characterTableDesktop" className="hidden sm:block">
          <div className="overflow-x-auto">
            <table
              id="characterTable"
              className="w-full bg-gray-800 border border-gray-300 text-center table-auto"
            >
              <thead>
                <tr>
                  <th
                    id="columnHeaderImage"
                    className="py-2 px-4 border-b border-gray-600 text-gray-100"
                  >
                    Image
                  </th>
                  <th
                    id="columnHeaderName"
                    className="py-2 px-4 border-b border-gray-600 text-gray-100"
                  >
                    Name
                  </th>
                  <th
                    id="columnHeaderHouse"
                    className="py-2 px-4 border-b border-gray-600 text-gray-100"
                  >
                    House
                  </th>
                  <th
                    id="columnHeaderDateOfBirth"
                    className="py-2 px-4 border-b border-gray-600 text-gray-100"
                  >
                    Date of Birth
                  </th>
                  <th
                    id="columnHeaderActor"
                    className="py-2 px-4 border-b border-gray-600 text-gray-100"
                  >
                    Actor
                  </th>
                </tr>
              </thead>
              <tbody>
                {characters.map((character) => {
                  const id = generateId(character.name);
                  return (
                    <tr
                      key={character.id}
                      id={`characterRow${id}`}
                      className="hover:bg-gray-600 text-gray-100"
                    >
                      <td className="py-2 px-4 border-b border-gray-600 text-gray-100">
                        <div className="flex items-center justify-center w-16 h-16 relative">
                          <Image
                            src={character.image}
                            alt={character.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            id={`photo${id}`}
                          />
                        </div>
                      </td>
                      <td
                        id={`tableCharacterName${id}`}
                        className="py-2 px-4 border-b border-gray-600 text-gray-100"
                      >
                        {character.name}
                      </td>
                      <td
                        id={`tableCharacterHouse${id}`}
                        className="py-2 px-4 border-b border-gray-600 text-gray-100"
                      >
                        {character.house}
                      </td>
                      <td
                        id={`tableCharacterDateOfBirth${id}`}
                        className="py-2 px-4 border-b border-gray-600 text-gray-100"
                      >
                        {character.dateOfBirth || 'Unknown'}
                      </td>
                      <td
                        id={`tableCharacterActor${id}`}
                        className="py-2 px-4 border-b border-gray-600 text-gray-100"
                      >
                        {character.actor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterTable;
