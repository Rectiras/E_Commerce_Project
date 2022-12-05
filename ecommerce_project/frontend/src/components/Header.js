import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container,NavDropdown} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
import logo from '../sumed.jpeg'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()
    const logoutHandler = () => {
         dispatch(logout())
    }
    return (
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand><img src={logo} style={{width:150, marginRight: 30}}   ></img>SU GIFTSHOP</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="ml-auto">
                <LinkContainer to='/cart'>
                  <Nav.Link ><i className=" fas fa-shopping-cart"></i>Cart</Nav.Link>
                </LinkContainer>
                 {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                                    </LinkContainer>
                                )}

                                {userInfo && userInfo.isAdmin && userInfo['groups'][0]['name']=='productManager' && (
                                    <NavDropdown title={userInfo['groups'][0]['name']} id='adminmenue'>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>User</NavDropdown.Item>
                                        </LinkContainer>
                             
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Product</NavDropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Orders</NavDropdown.Item>
                                        </LinkContainer>
                                        
                                        <LinkContainer to='/admin/reviewlist'>
                                            <NavDropdown.Item>Reviews</NavDropdown.Item>
                                        </LinkContainer>  
                                  </NavDropdown>
                                )}
                                {userInfo && userInfo.isAdmin && userInfo['groups'][0]['name']=='salesManager' && (
                                    <NavDropdown title={userInfo['groups'][0]['name']} id='adminmenue'>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>User</NavDropdown.Item>
                                        </LinkContainer>
                             
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Product</NavDropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Orders</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/refundlist'>
                                            <NavDropdown.Item>Refunds</NavDropdown.Item>
                                        </LinkContainer>
                                  </NavDropdown>
                                )}

              </Nav>
               
            </Navbar.Collapse>
          </Container> 
        </Navbar>
      </header>
    )
}

export default Header
