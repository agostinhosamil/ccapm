import React from 'react'

import { StyleSheet } from '@utils/StyleSheet'
import { CreateStylesProps, StyleProps } from '@utils/styled/createStyles'

type CreateStyledReactElementProps = {
  elementStyles: StyleProps
  props: CreateStylesProps
}

function createStyledReactElement(elementTagName: string, { elementStyles, props }: CreateStyledReactElementProps) {
  const stylesheet = new StyleSheet(elementStyles, { props })

  //
  // const element = App.createElement(
  //   elementTagName,
  //   objectFullMerge(props, {
  //     class: stylesheet.className
  //   })
  // )
  //
  // return (element)
  //

  return React.createElement(elementTagName, {
    ...props,
    className: `${stylesheet.className}`
  })
}

export function createStyledElement(elementTagName: string, elementStyles: StyleProps) {
  return function (props: CreateStylesProps) {
    return createStyledReactElement(elementTagName, { elementStyles, props })
  }
}

//#region styled html elements utils aliases
export function video(elementStyles: StyleProps) {
  return createStyledElement('video', elementStyles)
}

export function unknown(elementStyles: StyleProps) {
  return createStyledElement('unknown', elementStyles)
}

export function uList(elementStyles: StyleProps) {
  return createStyledElement('ul', elementStyles)
}

export function ul(elementStyles: StyleProps) {
  return createStyledElement('ul', elementStyles)
}

export function track(elementStyles: StyleProps) {
  return createStyledElement('track', elementStyles)
}

export function title(elementStyles: StyleProps) {
  return createStyledElement('title', elementStyles)
}

export function time(elementStyles: StyleProps) {
  return createStyledElement('time', elementStyles)
}

export function textarea(elementStyles: StyleProps) {
  return createStyledElement('textarea', elementStyles)
}

export function template(elementStyles: StyleProps) {
  return createStyledElement('template', elementStyles)
}

export function tableSection(elementStyles: StyleProps) {
  return createStyledElement('tableSection', elementStyles)
}

export function tableRow(elementStyles: StyleProps) {
  return createStyledElement('tr', elementStyles)
}

export function tr(elementStyles: StyleProps) {
  return createStyledElement('tr', elementStyles)
}

export function table(elementStyles: StyleProps) {
  return createStyledElement('table', elementStyles)
}

export function tableCol(elementStyles: StyleProps) {
  return createStyledElement('td', elementStyles)
}

export function td(elementStyles: StyleProps) {
  return createStyledElement('td', elementStyles)
}

export function tableCell(elementStyles: StyleProps) {
  return createStyledElement('th', elementStyles)
}

export function th(elementStyles: StyleProps) {
  return createStyledElement('th', elementStyles)
}

export function tableCaption(elementStyles: StyleProps) {
  return createStyledElement('tableCaption', elementStyles)
}

export function style(elementStyles: StyleProps) {
  return createStyledElement('style', elementStyles)
}

export function span(elementStyles: StyleProps) {
  return createStyledElement('span', elementStyles)
}

export function source(elementStyles: StyleProps) {
  return createStyledElement('source', elementStyles)
}

export function slot(elementStyles: StyleProps) {
  return createStyledElement('slot', elementStyles)
}

export function select(elementStyles: StyleProps) {
  return createStyledElement('select', elementStyles)
}

export function script(elementStyles: StyleProps) {
  return createStyledElement('script', elementStyles)
}

export function quote(elementStyles: StyleProps) {
  return createStyledElement('quote', elementStyles)
}

export function progress(elementStyles: StyleProps) {
  return createStyledElement('progress', elementStyles)
}

export function pre(elementStyles: StyleProps) {
  return createStyledElement('pre', elementStyles)
}

export function picture(elementStyles: StyleProps) {
  return createStyledElement('picture', elementStyles)
}

export function param(elementStyles: StyleProps) {
  return createStyledElement('param', elementStyles)
}

export function paragraph(elementStyles: StyleProps) {
  return createStyledElement('paragraph', elementStyles)
}

export function output(elementStyles: StyleProps) {
  return createStyledElement('output', elementStyles)
}

export function option(elementStyles: StyleProps) {
  return createStyledElement('option', elementStyles)
}

export function optgroup(elementStyles: StyleProps) {
  return createStyledElement('optgroup', elementStyles)
}

export function object(elementStyles: StyleProps) {
  return createStyledElement('object', elementStyles)
}

export function oList(elementStyles: StyleProps) {
  return createStyledElement('ol', elementStyles)
}

export function ol(elementStyles: StyleProps) {
  return createStyledElement('ol', elementStyles)
}

export function mod(elementStyles: StyleProps) {
  return createStyledElement('mod', elementStyles)
}

export function meter(elementStyles: StyleProps) {
  return createStyledElement('meter', elementStyles)
}

export function meta(elementStyles: StyleProps) {
  return createStyledElement('meta', elementStyles)
}

export function menu(elementStyles: StyleProps) {
  return createStyledElement('menu', elementStyles)
}

export function media(elementStyles: StyleProps) {
  return createStyledElement('media', elementStyles)
}

export function marquee(elementStyles: StyleProps) {
  return createStyledElement('marquee', elementStyles)
}

export function map(elementStyles: StyleProps) {
  return createStyledElement('map', elementStyles)
}

export function link(elementStyles: StyleProps) {
  return createStyledElement('link', elementStyles)
}

export function legend(elementStyles: StyleProps) {
  return createStyledElement('legend', elementStyles)
}

export function label(elementStyles: StyleProps) {
  return createStyledElement('label', elementStyles)
}

export function li(elementStyles: StyleProps) {
  return createStyledElement('li', elementStyles)
}

export function input(elementStyles: StyleProps) {
  return createStyledElement('input', elementStyles)
}

export function image(elementStyles: StyleProps) {
  return createStyledElement('image', elementStyles)
}

export function iframe(elementStyles: StyleProps) {
  return createStyledElement('iframe', elementStyles)
}

export function html(elementStyles: StyleProps) {
  return createStyledElement('html', elementStyles)
}

export function heading(elementStyles: StyleProps) {
  return createStyledElement('h1', elementStyles)
}

export function h1(elementStyles: StyleProps) {
  return createStyledElement('h1', elementStyles)
}

export function h2(elementStyles: StyleProps) {
  return createStyledElement('h2', elementStyles)
}

export function h3(elementStyles: StyleProps) {
  return createStyledElement('h3', elementStyles)
}

export function h4(elementStyles: StyleProps) {
  return createStyledElement('h4', elementStyles)
}

export function h5(elementStyles: StyleProps) {
  return createStyledElement('h5', elementStyles)
}

export function h6(elementStyles: StyleProps) {
  return createStyledElement('h6', elementStyles)
}

export function head(elementStyles: StyleProps) {
  return createStyledElement('head', elementStyles)
}

export function hr(elementStyles: StyleProps) {
  return createStyledElement('hr', elementStyles)
}

export function frameset(elementStyles: StyleProps) {
  return createStyledElement('frameset', elementStyles)
}

export function frame(elementStyles: StyleProps) {
  return createStyledElement('frame', elementStyles)
}

export function form(elementStyles: StyleProps) {
  return createStyledElement('form', elementStyles)
}

export function font(elementStyles: StyleProps) {
  return createStyledElement('font', elementStyles)
}

export function fieldset(elementStyles: StyleProps) {
  return createStyledElement('fieldset', elementStyles)
}

export function embed(elementStyles: StyleProps) {
  return createStyledElement('embed', elementStyles)
}

export function div(elementStyles: StyleProps) {
  return createStyledElement('div', elementStyles)
}

export function directory(elementStyles: StyleProps) {
  return createStyledElement('directory', elementStyles)
}

export function dialog(elementStyles: StyleProps) {
  return createStyledElement('dialog', elementStyles)
}

export function details(elementStyles: StyleProps) {
  return createStyledElement('details', elementStyles)
}

export function datalist(elementStyles: StyleProps) {
  return createStyledElement('datalist', elementStyles)
}

export function data(elementStyles: StyleProps) {
  return createStyledElement('data', elementStyles)
}

export function dl(elementStyles: StyleProps) {
  return createStyledElement('dl', elementStyles)
}

export function canvas(elementStyles: StyleProps) {
  return createStyledElement('canvas', elementStyles)
}

export function button(elementStyles: StyleProps) {
  return createStyledElement('button', elementStyles)
}

export function body(elementStyles: StyleProps) {
  return createStyledElement('body', elementStyles)
}

export function base(elementStyles: StyleProps) {
  return createStyledElement('base', elementStyles)
}

export function br(elementStyles: StyleProps) {
  return createStyledElement('br', elementStyles)
}

export function audio(elementStyles: StyleProps) {
  return createStyledElement('audio', elementStyles)
}

export function area(elementStyles: StyleProps) {
  return createStyledElement('area', elementStyles)
}

export function a(elementStyles: StyleProps) {
  return createStyledElement('a', elementStyles)
}
//#endregion

export default {
  video,
  unknown,
  uList,
  ul,
  track,
  title,
  time,
  textarea,
  template,
  tableSection,
  tableRow,
  table,
  tableCol,
  tableCell,
  tableCaption,
  style,
  span,
  source,
  slot,
  select,
  script,
  quote,
  progress,
  pre,
  picture,
  param,
  paragraph,
  output,
  option,
  optgroup,
  object,
  oList,
  ol,
  mod,
  meter,
  meta,
  menu,
  media,
  marquee,
  map,
  link,
  legend,
  label,
  li,
  input,
  image,
  iframe,
  html,
  heading,
  head,
  hr,
  frameset,
  frame,
  form,
  font,
  fieldset,
  embed,
  div,
  directory,
  dialog,
  details,
  datalist,
  data,
  dl,
  canvas,
  button,
  body,
  base,
  br,
  audio,
  area,
  a,
  tr,
  td,
  th,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6
}
