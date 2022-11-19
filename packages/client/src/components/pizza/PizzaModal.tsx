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

  return (
    <Formik
      initialValues={{
        name: selectedPizza?.name,
        description: selectedPizza?.description,
        toppingIds: selectedPizza?.toppingIds,
        imgSrc: selectedPizza?.imgSrc,
      }}
      enableReinitialize
      validate={(values): void => {
        let errors: any = {};
        if (!values.name) {
          errors.name = 'Required!';
        }
        if (!values.description) {
          errors.description = 'Required!';
        }
        if (!values.imgSrc) {
          errors.imgSrc = 'Required!';
        }
        if (!values.toppingIds) {
          errors.toppingsIds = 'Required!';
        }

        return errors;
      }}
      onSubmit={(values, { resetForm }): void => {
        if (selectedPizza?.id) {
          const givePizza = { id: selectedPizza.id, ...values };
          onUpdatePizza(givePizza);
          resetForm();
          setOpen(false);
        } else {
          onCreatePizza(values);
          resetForm();
          setOpen(false);
        }
      }}
    >
      {(props: FormikProps<any>): JSX.Element => (
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
          <Form className={classes.root} noValidate autoComplete="off">
            <Fade in={open}>
              <Paper className={classes.paper}>
                <div>
                  <h1 className={classes.modal}>{props.values.name ? 'Edit Pizza' : 'Add Pizza'}</h1>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '15rem',
                      margin: '1rem',
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
                          placeholder="Name"
                          value={props.values.name ? props.values.name : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                      {props.errors.name && props.touched.name && <div>{props.errors.name}</div>}
                    </div>
                    <div className={classes.div}>
                      <div style={{ width: '25%' }}>
                        <p>Description:</p>
                      </div>
                      <div>
                        <TextField
                          id="description"
                          name="description"
                          placeholder="Description"
                          value={props.values.description ? props.values.description : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                      {props.errors.description && props.touched.description && <div>{props.errors.description}</div>}
                    </div>

                    <div className={classes.div}>
                      <div style={{ width: '25%' }}>
                        <p>Image URL:</p>
                      </div>
                      <div>
                        <TextField
                          id="imgSrc"
                          name="imgSrc"
                          placeholder="Image URL"
                          value={props.values.imgSrc ? props.values.imgSrc : ''}
                          onChange={props.handleChange}
                        />
                      </div>
                      {props.errors.imgSrc && props.touched.imgSrc && <div>{props.errors.imgSrc}</div>}
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
                                  <MenuItem key={topping.id} value={topping.id}>
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
              </Paper>
            </Fade>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default PizzaModal;
