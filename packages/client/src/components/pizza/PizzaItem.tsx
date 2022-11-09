import { Pizza } from '../../types';
import CardItem from '../common/CardItem';
import { AddCircle } from '@material-ui/icons';
import { CardMedia, CardContent, Typography, Theme, createStyles, ListItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import toDollars from '../../lib/format-dollars';

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

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, selectPizza, ...props }) => {
  const classes = useStyles();

  return (
    <ListItem {...props} className={classes.header}>
      <CardItem data-testid={`pizza-card-${pizza?.id}`} onClick={(): void => selectPizza(pizza)}>
        {pizza?.imgSrc ? (
          <CardMedia
            data-testid={`pizza-image-${pizza?.id}`}
            component="img"
            height="300ch"
            image={pizza?.imgSrc}
            alt={pizza?.name}
          />
        ) : (
          <CardMedia
            component="img"
            height="300ch"
            data-testid={`pizza-image-${pizza?.id}`}
            image={
              'https://images.unsplash.com/photo-1489564239502-7a532064e1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
            }
            alt={pizza?.name}
          />
        )}
        <CardContent>
          <Typography data-testid={`pizza-name-${pizza?.id}`} gutterBottom variant="h5" component="div">
            {pizza?.name ? `Name: ${pizza?.name}` : 'Make a Pizza'} <br />
            {pizza?.id ? `Id: ${pizza?.id}` : ''}
          </Typography>
          <Typography data-testid={`pizza-description-${pizza?.id}`} gutterBottom variant="h6" component="div">
            {pizza?.description ? `Desc: ${pizza?.description}` : ''}
          </Typography>
          <Typography data-testid={`pizza-price-${pizza?.id}`} variant="h4" component="div">
            {pizza?.priceCents ? toDollars(pizza?.priceCents) : ''}
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
