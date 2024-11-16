import {
    Application,
    ContainerReflection,
    DefaultTheme,
    DefaultThemeRenderContext,
    JSX,
    Options,
    PageEvent,
    ProjectReflection,
    Reflection,
    RenderTemplate,
} from "typedoc"

class TridactylThemeContext extends DefaultThemeRenderContext {
    constructor(
        theme: DefaultTheme,
        page: PageEvent<Reflection>,
        options: Options,
    ) {
        super(theme, page, options)
        this.defaultLayout = this.customLayout.bind(this)
    }

    private customLayout(
        template: RenderTemplate<PageEvent<Reflection>>,
        props: PageEvent<Reflection>,
    ): JSX.Element {
        const head = (
            <>
                <meta charset="utf-8" />
                <title>
                    {props.model.name} | {props.project.name}
                </title>
                <meta name="description" content="" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script src="/content.js" />
                <script src="/help.js" />
                <link rel="stylesheet" href="/static/css/content.css" />
                <link rel="stylesheet" href="/static/css/hint.css" />
                <link rel="stylesheet" href="/static/css/viewsource.css" />
                <link
                    rel="stylesheet"
                    href="/static/typedoc/assets/css/main.css"
                />
            </>
        )

        const readme =
            props.model instanceof ProjectReflection
                ? props.model.readme
                : undefined

        const body = (
            <>
                <nav class="tsd-navigation secondary scroller">
                    <ul>{this.navigation(props)}</ul>
                </nav>

                <div class="container container-main scroller">
                    <div class="content-wrap">
                        {readme && (
                            <div class="tsd-panel tsd-typography">
                                 <JSX.Raw html={this.markdown(readme)} />
                            </div>
                        )}
                        {template(props)}
                    </div>
                </div>
            </>
        )

        return JSX.createElement(
            "html",
            { class: "minimal no-js TridactylOwnNamespace" },
            JSX.createElement("head", null, head),
            JSX.createElement("body", null, body),
        )
    }
}

export class TridactylTheme extends DefaultTheme {
    override getRenderContext(
        pageEvent: PageEvent<Reflection>,
    ): TridactylThemeContext {
        return new TridactylThemeContext(
            this,
            pageEvent,
            this.application.options,
        )
    }
}

export function load(app: Application) {
    // Register the custom theme
    app.renderer.defineTheme("tridactyl", TridactylTheme)
}
