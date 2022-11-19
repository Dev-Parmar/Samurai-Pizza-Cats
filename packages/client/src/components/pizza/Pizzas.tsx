import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import CardItem from '../common/CardItem';
import { AddCircle } from '@material-ui/icons';
import { Container, createStyles, Theme, Grid, CardContent, IconButton, Button } from '@material-ui/core';

import PageHeader from '../common/PageHeader';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import CardItemSkeleton from '../common/CardItemSkeleton';
import { Pizza } from '../../types';
import PizzaItem from './PizzaItem';
import PizzaModal from './PizzaModal';

const useStyles = makeStyles(({ typography, spacing }: Theme) =>
  createStyles({
    container: {
      minWidth: typography.pxToRem(650),
    },
    skeleton: {
      minWidth: typography.pxToRem(650),
      display: 'flex',
      justifyContent: 'center',
      verticalAlign: 'center',
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: spacing(2, 5, 2),
      height: typography.pxToRem(600),
      '&:hover': {
        cursor: 'pointer',
      },
    },
    image: {
      height: '35ch',
      width: '35ch',
    },
    name: {
      display: 'flex',
      justifyContent: 'center',
      margin: spacing(1, 0, 1),
      fontSize: typography.pxToRem(20),
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      margin: spacing(5, 0, 1),
    },
  })
);

const Pizzas: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Partial<Pizza>>();

  const { loading, error, data, refetch } = useQuery(GET_PIZZAS, {
    variables: {
      input: {
        cursor: null,
        limit: 8,
      },
    },
  });

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

  const pizzaList = data?.pizzas.results.map((pizza: Pizza) => (
    <PizzaItem data-testid={`pizza-item-${pizza?.id}`} key={pizza.id} pizza={pizza} selectPizza={selectPizza} />
  ));

  return (
    <Container>
      <PageHeader pageHeader={'Pizzas'} />
      <Grid container spacing={4} className={classes.container}>
        <Grid item sm={12} md={6} lg={4}>
          <CardItem onClick={(): void => selectPizza()}>
            <div className={classes.image}>
              <img
                className={classes.image}
                src={
                  'https://images.unsplash.com/photo-1489564239502-7a532064e1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                }
              />
            </div>
            <CardContent>
              <div className={classes.name}>
                <h4>Make a Pizza</h4>
              </div>
              <IconButton
                edge="end"
                size="medium"
                aria-label="modify"
                type="button"
                onClick={(): void => selectPizza()}
              >
                <AddCircle />
              </IconButton>
            </CardContent>
          </CardItem>
        </Grid>
        {pizzaList}
      </Grid>
      {data.pizzas.hasNextPage ? (
        <div className={classes.button}>
          <Button
            size="large"
            variant="outlined"
            onClick={(): any => refetch({ input: { cursor: data.pizzas.cursor, limit: 8 } })}
          >
            See More Pizzas
          </Button>
        </div>
      ) : null}

      <PizzaModal selectedPizza={selectedPizza} open={open} setOpen={setOpen} />
    </Container>
  );
};

export default Pizzas;
