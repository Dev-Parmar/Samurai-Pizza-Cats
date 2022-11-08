import { Pizza } from '../../types';
import CardItem from '../common/CardItem';
import { AddCircle } from '@material-ui/icons';
import { CardMedia, CardContent, Typography, Theme, createStyles, ListItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import toDollars from '../../lib/format-dollars';
import '../../assets/img/default-pizza.jpeg';

export interface PizzaItemProps {
  pizza?: Pizza;
  selectPizza: (pizza?: Pizza) => void;
}

const useStyles = makeStyles(({}: Theme) =>
  createStyles({
    header: {
      display: 'flex',
    },
  })
);

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, selectPizza }) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.header}>
      <CardItem onClick={(): void => selectPizza(pizza)}>
        <Typography variant="h6" component="div">
          {pizza?.priceCents ? toDollars(pizza?.priceCents) : ''}
        </Typography>
        {pizza?.imgSrc ? (
          <CardMedia component="img" height="300ch" image={pizza?.imgSrc} alt={pizza?.name} />
        ) : (
          <CardMedia
            component="img"
            height="300ch"
            image={
              'https://images.unsplash.com/photo-1489564239502-7a532064e1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
            }
            alt={pizza?.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pizza?.name ? `Name: ${pizza?.name}` : 'Make a Pizza'} <br />
            {pizza?.id ? `Id: ${pizza?.id}` : ''}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {pizza?.description ? `Desc: ${pizza?.description}` : ''}
          </Typography>
          <Typography variant="body2" component="div">
            {pizza?.toppings
              ? pizza?.toppings.map((topping) => (
                  <p key={topping.id}>
                    {topping.name} ------ {toDollars(topping.priceCents)} ------ {topping.id}
                  </p>
                ))
              : null}
          </Typography>
          <IconButton edge="end" aria-label="modify" type="button" onClick={(): void => selectPizza(pizza)}>
            {pizza ? null : <AddCircle />}
          </IconButton>
        </CardContent>
      </CardItem>
    </ListItem>
  );
};

export default PizzaItem;
