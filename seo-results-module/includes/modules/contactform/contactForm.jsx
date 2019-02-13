/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T09:05:38-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: contactForm.jsx
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-02-13T13:09:16-08:00
 */

// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class ContactForm extends Component {

  static slug = 'serm_hello_world';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default ContactForm;
