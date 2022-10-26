import { Pizza } from '../../types';
import CardItem from '../common/CardItem';
import { CardMedia, CardContent, Typography, Theme, createStyles, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import toDollars from '../../lib/format-dollars';

export interface PizzaItemProps {
  pizza?: Pizza;
}

const useStyles = makeStyles(({}: Theme) =>
  createStyles({
    header: {
      display: 'flex',
    },
  })
);

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza }) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.header}>
      <CardItem>
        <Typography variant="h6" component="div">
          {pizza?.priceCents ? toDollars(pizza?.priceCents) : ''}
        </Typography>
        {pizza?.imgSrc ? <CardMedia component="img" height="250" image={pizza?.imgSrc} alt={pizza?.name} /> : null}
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
        </CardContent>
      </CardItem>
    </ListItem>
  );
};

export default PizzaItem;
