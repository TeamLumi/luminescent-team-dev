import React from 'react';
import Layout from '@theme/Layout';

import MoveListPageContent from '../components/MoveDex/MoveListPageContent';
import { GlobalState } from '../components/common/GlobalState';
import LumiReactThemeProvider from '../theme/LumiThemeProvider';

const MoveDexListPage = ({ movesList }) => {
  return(
    <Layout
    title="Move Dex"
    description="A Rom Hack for Pokémon Brilliant Diamond."
    >
      <LumiReactThemeProvider>
        <GlobalState>
          <MoveListPageContent movesList={movesList}/>
        </GlobalState>
      </LumiReactThemeProvider>
    </Layout>
  );
};

export default MoveDexListPage;
