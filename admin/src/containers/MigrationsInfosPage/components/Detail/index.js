import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@buffetjs/core';
import InfoText from '../InfoText';
import Wrapper from '../Wrapper';

const Detail = ({ content, title }) => {
  return (
    <Wrapper>
      <Text fontSize="xs" color="grey" fontWeight="bold">
        {title}
      </Text>
      <InfoText content={content} />
    </Wrapper>
  );
};

Detail.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Detail;
