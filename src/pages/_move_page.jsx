import React from "react";
import Layout from "@theme/Layout";

import MovePageContent from '../components/MoveDex/MovePageContent';

export default function MovePage({ move2, move3, moveV, moveList }) {
  // required for webpack SSR
  if (typeof move2 === 'undefined' || typeof moveList === 'undefined') {
    console.error("ONE OF THE THINGS IS UNDEFINED!", move2, moveList);
    return null;
  }

  return (
    <Layout>
      <MovePageContent
        move2={move2}
        move3={move3}
        moveV={moveV}
        movesList={moveList}
      />
    </Layout>
  );
};