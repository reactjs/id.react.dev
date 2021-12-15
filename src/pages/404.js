/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Halaman Tidak Ditemukan</Header>
          <TitleAndMetaTags title="React - Halaman Tidak Ditemukan" />
          <div css={sharedStyles.markdown}>
            <p>Kami tidak dapat menemukan yang Anda cari.</p>
            <p>
              Silakan hubungi pemilik situs yang menautkan Anda ke URL asli dan beri tahu mereka bahwa tautan mereka rusak.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
