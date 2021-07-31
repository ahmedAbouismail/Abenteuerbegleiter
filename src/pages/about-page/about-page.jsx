import React from 'react';

import { ReactComponent as Cover } from "../../assets/about-cover.svg"
import "./_about-page.scss"

const AboutPage = () => {
    return (
        <div className="about-page">
            <Cover className="cover" />
            <div className="text-content">
                <p className="text">
                    This webapp was created to fulfill a project in a course called "Web-Anwendung im Ingenieurwesen" from HTW Berlin. We hope you can enjoy it.
                </p>
                <p>Ahmed Abouismail</p>
                <p>Verbena Haritzah Assidiqi</p>
            </div>
            <div className="ground" />
        </div>
    );
};

export default AboutPage;