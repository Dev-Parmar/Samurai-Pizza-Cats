import { Pizza } from '../../types';
import CardItem from '../common/CardItem';
import { CardContent, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import toDollars from '../../lib/format-dollars';

export interface PizzaItemProps {
  pizza?: Pizza;
  selectPizza: (pizza?: Pizza) => void;
}

const useStyles = makeStyles(({ typography, spacing }: Theme) => ({
  name: {
    display: 'flex',
    justifyContent: 'center',
    margin: spacing(1, 0, 1),
    fontSize: typography.pxToRem(20),
  },
  description: {
    display: 'flex',
    justifyContent: 'center',
    margin: spacing(1, 0, 1),
  },
  p: {
    fontSize: typography.pxToRem(16),
  },
  image: {
    height: '35ch',
    width: '35ch',
  },
}));

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, selectPizza, ...props }) => {
  const classes = useStyles();
  return (
    <Grid item {...props} sm={12} md={6} lg={4}>
      <CardItem data-testid={`pizza-card-${pizza?.id}`} onClick={(): void => selectPizza(pizza)}>
        <div className={classes.image}>
          <img
            data-testid={`pizza-image-${pizza?.id}`}
            className={classes.image}
            src={pizza?.imgSrc}
            alt={pizza?.name}
          />
        </div>

        <CardContent>
          <div data-testid={`pizza-name-${pizza?.id}`} className={classes.name}>
            <h4>{pizza?.name} </h4>
          </div>
          <div data-testid={`pizza-description-${pizza?.id}`} className={classes.name}>
            <p className={classes.p}>{pizza?.description} </p>
          </div>
          <div data-testid={`pizza-price-${pizza?.id}`} className={classes.name}>
            <h5>{pizza?.priceCents ? toDollars(pizza?.priceCents) : ''} </h5>
          </div>
        </CardContent>
      </CardItem>
    </Grid>
  );
};

export default PizzaItem;
