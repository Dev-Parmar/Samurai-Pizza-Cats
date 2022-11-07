import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import { Container, createStyles, Theme, List } from '@material-ui/core';

import PageHeader from '../common/PageHeader';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import CardItemSkeleton from '../common/CardItemSkeleton';
import { Pizza } from '../../types';
import PizzaItem from './PizzaItem';
import PizzaModal from './PizzaModal';

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

  const [open, setOpen] = React.useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Partial<Pizza>>();

  const { loading, error, data } = useQuery(GET_PIZZAS);

  const selectPizza = (pizza?: Pizza): void => {
    setSelectedPizza(pizza);
    setOpen(true);
  };

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
    <PizzaItem data-testid={`pizza-item-${pizza?.id}`} key={pizza.id} pizza={pizza} selectPizza={selectPizza} />
  ));

  return (
    <Container maxWidth="md">
      <PageHeader pageHeader={'Pizzas'} />
      <List className={classes.container}>
        <PizzaItem key="add-pizza" selectPizza={selectPizza} />
        {pizzaList}
      </List>

      <PizzaModal selectedPizza={selectedPizza} open={open} setOpen={setOpen} />
    </Container>
  );
};

export default Pizzas;
