import React from 'react';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import { Container, createStyles, Theme, List } from '@material-ui/core';

import PageHeader from '../common/PageHeader';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import CardItemSkeleton from '../common/CardItemSkeleton';
import { Pizza } from '../../types';
import PizzaItem from './PizzaItem';

const useStyles = makeStyles(({ typography }: Theme) =>
  createStyles({
    container: {
      minWidth: typography.pxToRem(650),
    },
    skeleton: {
      display: 'flex',
      justifyContent: 'center',
      verticalAlign: 'center',
    },
  })
);

const Pizzas: React.FC = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_PIZZAS);

  if (loading) {
    return (
      <div className={classes.skeleton}>
        <CardItemSkeleton data-testid={`pizza-list-loading`}>Loading ...</CardItemSkeleton>
      </div>
    );
  }

  if (error) {
    return <div className={classes.skeleton}>{error.message}</div>;
  }

  const pizzaList = data?.pizzas.map((pizza: Pizza) => (
    <PizzaItem data-testid={`pizza-item-${pizza?.id}`} key={pizza.id} pizza={pizza} />
  ));

  return (
    <Container maxWidth="md">
      <PageHeader pageHeader={'Pizzas'} />
      <List className={classes.container}>
        <PizzaItem key="add-pizza" />
        {pizzaList}
      </List>
    </Container>
  );
};

export default Pizzas;
