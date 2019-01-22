import { Observable, Atom, AnyEvent } from "francis";
import * as React from "react";

type Reactive<T> =
  | (T extends React.EventHandler<infer H>
      ? Observable<React.EventHandler<H>>
      : T extends React.CSSProperties
      ? Observable<T> | { [P in keyof React.CSSProperties]: Reactive<T[P]> }
      : Observable<T>)
  | T;

type FrancisHTMLAttributes<E extends React.HTMLAttributes<T>, T> = {
  [K in keyof E]: Reactive<E[K]>
};

type FrancisSVGAttributes<T> = {
  [K in keyof React.SVGAttributes<T>]: Reactive<React.SVGAttributes<T>[K]>
};

type FrancisClassAttributes<T> = {
  key?: React.Key;
  ref?: Observable<React.LegacyRef<T>> | React.LegacyRef<T>;
};

type FrancisHTMLProps<E, T> = E extends React.HTMLAttributes<T>
  ? FrancisClassAttributes<T> & FrancisHTMLAttributes<E, T>
  : never;

type FrancisSVGProps<T> = FrancisSVGAttributes<T> & FrancisClassAttributes<T>;

declare module "react" {
  /**
   * Creates local state atom that preserves its state over re-renders.
   *
   * @param initialValue Initial value of the local state atom
   */
  export function useStateAtom<ValueType>(
    initialValue: ValueType
  ): Atom<ValueType>;

  export function useSubscription<ValueType>(
    f: (event: AnyEvent<ValueType>) => any
  ): (observable: Observable<ValueType>) => void;
  export function useSubscription<ValueType>(
    f: (event: AnyEvent<ValueType>) => any,
    observable: Observable<ValueType>
  ): void;

  namespace JSX {
    interface IntrinsicElements {
      // HTML
      a: FrancisHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      abbr: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      address: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      area: FrancisHTMLProps<
        React.AreaHTMLAttributes<HTMLAreaElement>,
        HTMLAreaElement
      >;
      article: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: FrancisHTMLProps<
        React.AudioHTMLAttributes<HTMLAudioElement>,
        HTMLAudioElement
      >;
      b: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      base: FrancisHTMLProps<
        React.BaseHTMLAttributes<HTMLBaseElement>,
        HTMLBaseElement
      >;
      bdi: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      big: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: FrancisHTMLProps<
        React.BlockquoteHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      body: FrancisHTMLProps<
        React.HTMLAttributes<HTMLBodyElement>,
        HTMLBodyElement
      >;
      br: FrancisHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: FrancisHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      canvas: FrancisHTMLProps<
        React.CanvasHTMLAttributes<HTMLCanvasElement>,
        HTMLCanvasElement
      >;
      caption: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      cite: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      code: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      col: FrancisHTMLProps<
        React.ColHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      colgroup: FrancisHTMLProps<
        React.ColgroupHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      data: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      datalist: FrancisHTMLProps<
        React.HTMLAttributes<HTMLDataListElement>,
        HTMLDataListElement
      >;
      dd: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      del: FrancisHTMLProps<React.DelHTMLAttributes<HTMLElement>, HTMLElement>;
      details: FrancisHTMLProps<
        React.DetailsHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      dfn: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: FrancisHTMLProps<
        React.DialogHTMLAttributes<HTMLDialogElement>,
        HTMLDialogElement
      >;
      div: FrancisHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      dl: FrancisHTMLProps<
        React.HTMLAttributes<HTMLDListElement>,
        HTMLDListElement
      >;
      dt: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: FrancisHTMLProps<
        React.EmbedHTMLAttributes<HTMLEmbedElement>,
        HTMLEmbedElement
      >;
      fieldset: FrancisHTMLProps<
        React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
        HTMLFieldSetElement
      >;
      figcaption: FrancisHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      figure: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: FrancisHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
      h1: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h2: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h3: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h4: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h5: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h6: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      head: FrancisHTMLProps<
        React.HTMLAttributes<HTMLHeadElement>,
        HTMLHeadElement
      >;
      header: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: FrancisHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: FrancisHTMLProps<
        React.HtmlHTMLAttributes<HTMLHtmlElement>,
        HTMLHtmlElement
      >;
      i: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: FrancisHTMLProps<
        React.IframeHTMLAttributes<HTMLIFrameElement>,
        HTMLIFrameElement
      >;
      img: FrancisHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >;
      input: FrancisHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      ins: FrancisHTMLProps<
        React.InsHTMLAttributes<HTMLModElement>,
        HTMLModElement
      >;
      kbd: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      keygen: FrancisHTMLProps<
        React.KeygenHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      label: FrancisHTMLProps<
        React.LabelHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
      >;
      legend: FrancisHTMLProps<
        React.HTMLAttributes<HTMLLegendElement>,
        HTMLLegendElement
      >;
      li: FrancisHTMLProps<
        React.LiHTMLAttributes<HTMLLIElement>,
        HTMLLIElement
      >;
      link: FrancisHTMLProps<
        React.LinkHTMLAttributes<HTMLLinkElement>,
        HTMLLinkElement
      >;
      main: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      map: FrancisHTMLProps<
        React.MapHTMLAttributes<HTMLMapElement>,
        HTMLMapElement
      >;
      mark: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: FrancisHTMLProps<
        React.MenuHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      menuitem: FrancisHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      meta: FrancisHTMLProps<
        React.MetaHTMLAttributes<HTMLMetaElement>,
        HTMLMetaElement
      >;
      meter: FrancisHTMLProps<
        React.MeterHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      nav: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      noindex: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: FrancisHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      object: FrancisHTMLProps<
        React.ObjectHTMLAttributes<HTMLObjectElement>,
        HTMLObjectElement
      >;
      ol: FrancisHTMLProps<
        React.OlHTMLAttributes<HTMLOListElement>,
        HTMLOListElement
      >;
      optgroup: FrancisHTMLProps<
        React.OptgroupHTMLAttributes<HTMLOptGroupElement>,
        HTMLOptGroupElement
      >;
      option: FrancisHTMLProps<
        React.OptionHTMLAttributes<HTMLOptionElement>,
        HTMLOptionElement
      >;
      output: FrancisHTMLProps<
        React.OutputHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      p: FrancisHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      param: FrancisHTMLProps<
        React.ParamHTMLAttributes<HTMLParamElement>,
        HTMLParamElement
      >;
      picture: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: FrancisHTMLProps<
        React.HTMLAttributes<HTMLPreElement>,
        HTMLPreElement
      >;
      progress: FrancisHTMLProps<
        React.ProgressHTMLAttributes<HTMLProgressElement>,
        HTMLProgressElement
      >;
      q: FrancisHTMLProps<
        React.QuoteHTMLAttributes<HTMLQuoteElement>,
        HTMLQuoteElement
      >;
      rp: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      s: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      script: FrancisHTMLProps<
        React.ScriptHTMLAttributes<HTMLScriptElement>,
        HTMLScriptElement
      >;
      section: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      select: FrancisHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >;
      small: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      source: FrancisHTMLProps<
        React.SourceHTMLAttributes<HTMLSourceElement>,
        HTMLSourceElement
      >;
      span: FrancisHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
      >;
      strong: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      style: FrancisHTMLProps<
        React.StyleHTMLAttributes<HTMLStyleElement>,
        HTMLStyleElement
      >;
      sub: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      table: FrancisHTMLProps<
        React.TableHTMLAttributes<HTMLTableElement>,
        HTMLTableElement
      >;
      tbody: FrancisHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      td: FrancisHTMLProps<
        React.TdHTMLAttributes<HTMLTableDataCellElement>,
        HTMLTableDataCellElement
      >;
      textarea: FrancisHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >;
      tfoot: FrancisHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      th: FrancisHTMLProps<
        React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
        HTMLTableHeaderCellElement
      >;
      thead: FrancisHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      time: FrancisHTMLProps<
        React.TimeHTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      title: FrancisHTMLProps<
        React.HTMLAttributes<HTMLTitleElement>,
        HTMLTitleElement
      >;
      tr: FrancisHTMLProps<
        React.HTMLAttributes<HTMLTableRowElement>,
        HTMLTableRowElement
      >;
      track: FrancisHTMLProps<
        React.TrackHTMLAttributes<HTMLTrackElement>,
        HTMLTrackElement
      >;
      u: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: FrancisHTMLProps<
        React.HTMLAttributes<HTMLUListElement>,
        HTMLUListElement
      >;
      var: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      video: FrancisHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >;
      wbr: FrancisHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      webview: FrancisHTMLProps<
        React.WebViewHTMLAttributes<HTMLWebViewElement>,
        HTMLWebViewElement
      >;

      // SVG
      svg: FrancisSVGProps<SVGSVGElement>;

      animate: FrancisSVGProps<SVGElement>;
      animateTransform: FrancisSVGProps<SVGElement>;
      circle: FrancisSVGProps<SVGCircleElement>;
      clipPath: FrancisSVGProps<SVGClipPathElement>;
      defs: FrancisSVGProps<SVGDefsElement>;
      desc: FrancisSVGProps<SVGDescElement>;
      ellipse: FrancisSVGProps<SVGEllipseElement>;
      feBlend: FrancisSVGProps<SVGFEBlendElement>;
      feColorMatrix: FrancisSVGProps<SVGFEColorMatrixElement>;
      feComponentTransfer: FrancisSVGProps<SVGFEComponentTransferElement>;
      feComposite: FrancisSVGProps<SVGFECompositeElement>;
      feConvolveMatrix: FrancisSVGProps<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: FrancisSVGProps<SVGFEDiffuseLightingElement>;
      feDisplacementMap: FrancisSVGProps<SVGFEDisplacementMapElement>;
      feDistantLight: FrancisSVGProps<SVGFEDistantLightElement>;
      feFlood: FrancisSVGProps<SVGFEFloodElement>;
      feFuncA: FrancisSVGProps<SVGFEFuncAElement>;
      feFuncB: FrancisSVGProps<SVGFEFuncBElement>;
      feFuncG: FrancisSVGProps<SVGFEFuncGElement>;
      feFuncR: FrancisSVGProps<SVGFEFuncRElement>;
      feGaussianBlur: FrancisSVGProps<SVGFEGaussianBlurElement>;
      feImage: FrancisSVGProps<SVGFEImageElement>;
      feMerge: FrancisSVGProps<SVGFEMergeElement>;
      feMergeNode: FrancisSVGProps<SVGFEMergeNodeElement>;
      feMorphology: FrancisSVGProps<SVGFEMorphologyElement>;
      feOffset: FrancisSVGProps<SVGFEOffsetElement>;
      fePointLight: FrancisSVGProps<SVGFEPointLightElement>;
      feSpecularLighting: FrancisSVGProps<SVGFESpecularLightingElement>;
      feSpotLight: FrancisSVGProps<SVGFESpotLightElement>;
      feTile: FrancisSVGProps<SVGFETileElement>;
      feTurbulence: FrancisSVGProps<SVGFETurbulenceElement>;
      filter: FrancisSVGProps<SVGFilterElement>;
      foreignObject: FrancisSVGProps<SVGForeignObjectElement>;
      g: FrancisSVGProps<SVGGElement>;
      image: FrancisSVGProps<SVGImageElement>;
      line: FrancisSVGProps<SVGLineElement>;
      linearGradient: FrancisSVGProps<SVGLinearGradientElement>;
      marker: FrancisSVGProps<SVGMarkerElement>;
      mask: FrancisSVGProps<SVGMaskElement>;
      metadata: FrancisSVGProps<SVGMetadataElement>;
      path: FrancisSVGProps<SVGPathElement>;
      pattern: FrancisSVGProps<SVGPatternElement>;
      polygon: FrancisSVGProps<SVGPolygonElement>;
      polyline: FrancisSVGProps<SVGPolylineElement>;
      radialGradient: FrancisSVGProps<SVGRadialGradientElement>;
      rect: FrancisSVGProps<SVGRectElement>;
      stop: FrancisSVGProps<SVGStopElement>;
      switch: FrancisSVGProps<SVGSwitchElement>;
      symbol: FrancisSVGProps<SVGSymbolElement>;
      text: FrancisSVGProps<SVGTextElement>;
      textPath: FrancisSVGProps<SVGTextPathElement>;
      tspan: FrancisSVGProps<SVGTSpanElement>;
      use: FrancisSVGProps<SVGUseElement>;
      view: FrancisSVGProps<SVGViewElement>;
    }
  }
}

export = React;
