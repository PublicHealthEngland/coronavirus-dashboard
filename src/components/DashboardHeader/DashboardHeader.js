// @flow

import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import ReactTooltip from "react-tooltip";
import deepEqual from "deep-equal";
import 'moment/locale/en-gb';

import usePrevious from "hooks/usePrevious";
import LocationPicker from "./LocationPicker";
import LocationBanner from "components/LocationBanner";
import { analytics, getParams } from "common/utils";
import { getParamValueFor } from "./utils";
import { getOrder } from "./GenericHooks";
import {
    PathNameMapper,
    NoPickerPaths,
    LocationBannerMapper,
    PathWithHeader
} from "./Constants";

import {
    MainContainer,
    HeaderContainer,
    Title,
    SectionBreak,
} from './DashboardHeader.styles'

import type { ComponentType } from 'react';
import type { Props } from './DashboardHeader.types';
import { HalfCardHeader } from "../Card/Card.styles";


const PageHeader = ({ areaName, localisationState, localisationCallback }) => {

    const
        preppedLabel = areaName.toLowerCase().replace(/\s/g, "_"),
        pageHead = document.querySelector("head>title"),
        { location: { pathname } } = useHistory(),
        pageName = PathNameMapper[pathname],
        noPicker = NoPickerPaths.indexOf(pathname) > -1;

    pageHead.innerText = `Coronavirus (COVID-19) in the UK: ${ pageName }`;

    if ( !(PathWithHeader.indexOf(pathname) > -1) ) return null;

    return <>
        <HeaderContainer role={ "heading" }
                         aria-level={ 1 }
                         aria-labelledby={ `page-heading-${preppedLabel}` }>
            <Title pageName={ `${ pageName }${ noPicker ? "" : " in" }` }
                   data-for={ "open-localisation-tooltip" }
                   data-tip={ "Click to change location" }
                   id={ `page-heading-${ preppedLabel }` }
                   hasPicker={ !noPicker }
                   className={ localisationState ? "open" : "" }
                   onClick={ localisationCallback }>
                { ( pathname && pathname !== "/" ) && areaName }
                {
                    !noPicker
                        ? <span className={ "govuk-visually-hidden" }>
                            Click to change location
                        </span>
                        : null
                }
            </Title>
        </HeaderContainer>
        <SectionBreak/>
    </>

};  // PageHeader


const DashboardHeader: ComponentType<Props> = ({}: Props) => {

    const
        history = useHistory(),
        [locationPickerState, setLocationPickerState] = useState(false),
        params = getParams(history.location.search),
        areaName = getParamValueFor(params, "areaName", "United Kingdom"),
        pathname = history.location.pathname,
        areaTypeOrder = getOrder(history),
        isExcluded = NoPickerPaths.indexOf(pathname) > -1,
        prevPathname = usePrevious(pathname),
        initialParam = getParams(history.location.query),
        [ location, setLocation ] = useState({
            areaType: getParamValueFor(initialParam, "areaType", "overview"),
            areaName: getParamValueFor(initialParam, "areaName", "United Kingdom"),
        }),
        prevLocation = usePrevious(location);

    useEffect(() => {

        if ( location.areaName && !deepEqual(location.areaName, prevLocation.areaName) )
            setLocationPickerState(false);

    }, [ location.areaName, prevLocation.areaName ])

    useEffect(() => {

        if ( pathname !== prevPathname )
            setLocation({
                areaType: getParamValueFor(initialParam, "areaType", "overview"),
                areaName: getParamValueFor(initialParam, "areaName", "United Kingdom"),
            });

    }, [ pathname, prevPathname ])

    const locationPickerCallback = () => {
        analytics("Interaction", "Location picker", locationPickerState ? "OPEN" : "CLOSE");
        setLocationPickerState(state => !state)
    };

    return <MainContainer>
        <PageHeader areaName={ areaName }
                    localisationState={ locationPickerState }
                    localisationCallback={ locationPickerCallback }/>
        {
            !isExcluded &&
            <LocationPicker show={ locationPickerState }
                            currentLocation={ location }
                            setCurrentLocation={ setLocation }/>
        }
        <LocationBanner pageTitle={ LocationBannerMapper?.[pathname] ?? null }
                        areaTypes={ Object.keys(areaTypeOrder).map(key => areaTypeOrder[key]) }
                        pathname={ pathname }/>

        <ReactTooltip id={ "open-localisation-tooltip" }
                      place={ "right" }
                      backgroundColor={ "#0b0c0c" }
                      className={ "tooltip" }
                      effect={ "solid" }/>
    </MainContainer>

};  // DashboardHeader


export default DashboardHeader;
