import React, { Children } from 'react';
import { Helmet } from 'react-helmet';

const Layout = ({children,title,description,keywords,author}) => {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
}
Layout.defaultProps={
title: "SRI SAI ESTATE",
description: "Explore top-rated properties for sale and rent with SRI SAI Real Estate. From luxury apartments to family homes, we help you find the perfect property in your desired location.",
keywords:"real estate, buy home, rent property, luxury apartments, family houses, commercial spaces, SRI SAI Real Estate",
author:"SRI SAI ESTATE"
}
export default Layout;
