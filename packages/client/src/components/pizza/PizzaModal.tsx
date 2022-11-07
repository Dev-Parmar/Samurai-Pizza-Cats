import React from 'react';
import {
  Backdrop,
  createStyles,
  Fade,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Theme,
  MenuItem,
  Select,
  OutlinedInput,
  FormControl,
  Button,
} from '@material-ui/core';

import { Topping } from '../../types';
import { GET_TOPPINGS } from '../../hooks/graphql/topping/queries/get-toppings';
import { useQuery } from '@apollo/client';
import usePizzaMutations from '../../hooks/pizza/use-pizza-mutations';
import { Form, Formik, FormikProps, FieldArray } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: '50ch',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    div: {
      display: 'flex',
      alignItems: 'center',
    },
    p: { width: '20%' },
  })
);

interface PizzaModalProps {
  selectedPizza?: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PizzaModal = ({ selectedPizza, open, setOpen }: PizzaModalProps): JSX.Element => {
  const classes = useStyles();
  const { data } = useQuery(GET_TOPPINGS);

  const toppings = data?.toppings.map((topping: Topping) => topping);

  const { onCreatePizza, onUpdatePizza, onDeletePizza } = usePizzaMutations();

  const getToppingName = (givenTopping: string[]): string[] => {
    let updatedTopping: string[] = new Array();
    if (givenTopping) {
      givenTopping.map((e: any) => {
        toppings.find((nameTopping: any) => {
          if (nameTopping.id === e) {
            updatedTopping.push(nameTopping.name);
          }
        });
      });
    }
    return updatedTopping;
  };

  const getToppingIds = (givenTopping: any): any => {
    let updatedTopping: string[] = new Array();
    if (givenTopping) {
      givenTopping.map((e: any) => {
        toppings.find((nameTopping: any) => {
          if (nameTopping.name === e) {
            updatedTopping.push(nameTopping.id);
          }
        });
      });
      return updatedTopping;
    } else {
      return null;
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={(): void => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <Formik
            initialValues={{
              name: selectedPizza?.name,
              description: selectedPizza?.description,
              toppingIds: getToppingName(selectedPizza?.toppingIds),
              imgSrc: selectedPizza?.imgSrc,
            }}
            enableReinitialize
            onSubmit={(values): void => {
              values.toppingIds = getToppingIds(values.toppingIds);
              if (selectedPizza?.id) {
                const givePizza = { id: selectedPizza.id, ...values };
                onUpdatePizza(givePizza);
                setOpen(false);
              } else {
                onCreatePizza(values);
                setOpen(false);
              }
            }}
          >
            {(props: FormikProps<any>): JSX.Element => (
              <Form className={classes.root} noValidate autoComplete="off">
                <div>
                  <h1 className={classes.modal}>{props.values.name ? 'Edit Pizza' : 'Add Pizza'}</h1>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '20rem',
                      margin: '1.5rem',
                    }}
                  >
                    <img
                      src={props.values.imgSrc ? props.values.imgSrc : ''}
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                  <div style={{ margin: '1em' }}>
                    <h2>Details</h2>
                    <div className={classes.div}>
                      <div style={{ width: '25%' }}>
                        <p>Name:</p>
                      </div>
                      <div>
                        <TextField
                          id="name"
                          name="name"
                          value={props.values.name ? props.values.name : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                    </div>
                    <div className={classes.div}>
                      <div style={{ width: '25%' }}>
                        <p>Description:</p>
                      </div>
                      <div>
                        <TextField
                          id="description"
                          name="description"
                          value={props.values.description ? props.values.description : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                    </div>

                    <div className={classes.div}>
                      <div style={{ width: '25%' }}>
                        <p>Image URL:</p>
                      </div>
                      <div>
                        <TextField
                          id="imgSrc"
                          name="imgSrc"
                          value={props.values.imgSrc ? props.values.imgSrc : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ margin: '1em' }}>
                    <h2>Toppings</h2>
                    <div style={{ margin: '1.5em', width: '50px' }}>
                      <FieldArray
                        name="toppings"
                        render={(): JSX.Element => (
                          <div>
                            <FormControl style={{ width: '40ch' }}>
                              <Select
                                labelId="toppingIds"
                                name="toppingIds"
                                id="toppingIds"
                                multiple
                                value={props.values.toppingIds || []}
                                onChange={props.handleChange}
                                input={<OutlinedInput />}
                              >
                                {toppings.map((topping: Topping) => (
                                  <MenuItem key={topping.id} value={topping.name}>
                                    {topping.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div style={{ margin: '1em', display: 'flex', justifyContent: 'center' }}>
                    {selectedPizza?.id ? (
                      <div>
                        <Button type="submit">
                          <h2>Submit</h2>
                        </Button>
                        <Button
                          onClick={(): void => {
                            onDeletePizza(selectedPizza);
                            setOpen(false);
                          }}
                        >
                          <h2>Delete</h2>
                        </Button>
                      </div>
                    ) : (
                      <Button type="submit">
                        <h2>Submit</h2>
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default PizzaModal;
