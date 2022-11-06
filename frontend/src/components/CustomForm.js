import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


const CustomForm = ({ onSubmit, mode, restaurant }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [name, setName] = useState(restaurant?.name || "");
    const [country, setCountry] = useState(restaurant?.country || "");
    const [img, setImg] = useState(restaurant?.img || "");
    const [chain, setChain] = useState(restaurant?.chain || "");

    const handleSubmit = () => {
        const data = { name, country, img, chain };
        if (mode === "update") {
            onSubmit({id: restaurant.id, ...data});
        } else {
            onSubmit(data);
            // clear form 
            setName("");
            setCountry("");
            setImg("");
            setChain("");
        }
        handleClose();
    }

    return (
        <>
            {mode === "update" ?
                (<button className="button"><img src="https://res.cloudinary.com/dtwqtpteb/image/upload/v1582406346/zwvointr6yjve95cf4bw.png"
                    width="20" height="20" alt="update" onClick={handleShow} /></button>) :
                (<Button className="app-button" onClick={handleShow}>
                    Add restaurant
                </Button>)
            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{mode === 'update' ? 'Update restaurant': 'Add restaurant'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={name}
                                type="text"
                                placeholder="Restaurant name"
                                autoFocus
                                onChange={(event) => setName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                value={country}
                                type="text"
                                placeholder="Fill in country"
                                onChange={(event) => setCountry(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Chain</Form.Label>
                            <Form.Control
                                value={chain}
                                type="text"
                                placeholder="Chain"
                                onChange={(event) => setChain(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>img</Form.Label>
                            <Form.Control
                                value={img}
                                type="text"
                                placeholder="img"
                                onChange={(event) => setImg(event.target.value)}
                            />
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button  className='btn-app-style' onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default CustomForm;