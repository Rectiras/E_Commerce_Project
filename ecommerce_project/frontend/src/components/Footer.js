import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    return (    
        <footer >
            <Container>
                <Col className="text-center py-3">
                    <Row>Sabancı Üniversitesi Kampüsü UC 1093 </Row>
                    <Row>Orta Mah. Üniversite Cad. No.27 Orhanlı – Tuzla</Row>
                    <Row>sumed@sabanciuniv.edu</Row>
                    <Row>0216 483 9497</Row>
                </Col>
                <Row>
                     <Col className="text-center py-3">Copyright &copy; SUMED</Col>
                 </Row>
             </Container>
        </footer>   
    )
}

export default Footer
