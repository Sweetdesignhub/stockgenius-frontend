import React from 'react';
import PropTypes from 'prop-types';
import CountdownTimer from './CountdownTimer';

function ComingSoon({ description }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 rounded-lg shadow-lg text-center table-main">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Coming Soon</h1>
        <p className="text-lg text-gray-600 dark:text-white">{description}</p>
        <CountdownTimer />
      </div>
    </div>
  );
}

ComingSoon.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ComingSoon;
