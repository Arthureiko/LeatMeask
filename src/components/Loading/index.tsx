import React from 'react';
import Loader from 'react-loader-spinner';

import './styles.scss';

interface LoadingProps {
  title: string;
}

const Loading: React.FunctionComponent<LoadingProps> = ({ title }) => (
  <div className="container-loading">
    <Loader type="Hearts" color="#ff33cc" height={100} width={100} />
    <h1>{title}</h1>
  </div>
);

export default Loading;
