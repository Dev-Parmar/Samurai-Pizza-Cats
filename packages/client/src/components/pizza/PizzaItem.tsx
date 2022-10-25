import { Pizza } from '../../types';
import CardItem from '../common/CardItem';
import { CardMedia, CardContent, Typography, Theme, createStyles, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
        <CardMedia component="img" height="250" image={pizza?.imgSrc} alt={pizza?.name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pizza?.name ?? 'Make a Pizza'}({pizza?.id ?? ''})
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {pizza?.description}
          </Typography>
          <Typography variant="body2" component="div">
            {pizza?.toppings.map((topping) => (
              <li>
                {topping.name} ------ {topping.priceCents} ------ {topping.id}
              </li>
            ))}
          </Typography>
        </CardContent>
      </CardItem>
    </ListItem>
  );
};

export default PizzaItem;
