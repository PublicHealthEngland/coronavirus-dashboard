// @flow

import styled from "styled-components";

import type { ComponentType } from "react";



export const Container: ComponentType<*> =
    styled
        .div`
            max-width: 50em;
        `;


export const TablinkBodyContainer: ComponentType<*> =
    styled
        .div`
             &>div {
                display: grid;
             }
        `;