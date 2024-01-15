const carouselCss = 'carousel'
const carouselItemCss = `${carouselCss}-item`
const carouselTextCss = `${carouselCss}-text`
const carouselInnerCss = `${carouselCss}-inner`
const carouselSlideCss = `${carouselCss}-slide`
const carouselControlPrev = `${carouselCss}-control-prev`
const carouselControlNext = `${carouselCss}-control-next`
const activeCss = 'active'
const carouselNextAnimCss = `${carouselCss}-next__animation`
const carouselNextElemCss = `${carouselCss}-next__element`
const carouselPrevAnimCss = `${carouselCss}-prev__animation`
const carouselPrevElemCss = `${carouselCss}-prev__element`
const carouselIndicatorsCss = `${carouselCss}-indicators`

const directionOptions = {
    none: 0,
    next: 1,
    prev: -1,
}

const byControlDefault = -1

autoInit()

function autoInit() {
    /** @type {[HTMLElement]} */
    const els = [...document.getElementsByClassName(carouselCss)]

    for (const el of els) {
        /** @type {[SlideRow]} */
        const slides = []
        for (const elItem of [...el.querySelectorAll('.' + carouselItemCss)]) {
            /** @type HTMLImageElement */
            const img = elItem.querySelector('img')

            /**  @type HTMLElement */
            const text = elItem.querySelector('.' + carouselTextCss)
            if (img) {
                slides.push({
                    src: img.getAttribute('src'),
                    text: text?.innerHTML.trim() ?? '',
                })
            }
        }

        /** @type {CarouselInitial} */
        const initialParams = initDefaultParams()
        initialParams.withControl = 'controls' in el.dataset
        initialParams.withIndicators = 'indicators' in el.dataset
        initialParams.timeView =
            Number(el.dataset.timeView) > 0
                ? Number(el.dataset.timeView)
                : initialParams.timeView
        initialParams.width =
            Number(el.dataset.width) > 0
                ? Number(el.dataset.width)
                : initialParams.width
        initialParams.height =
            Number(el.dataset.height) > 0
                ? Number(el.dataset.height)
                : initialParams.height
        initialParams.timeSliding =
            Number(el.dataset.timeSliding) > 0
                ? Number(el.dataset.timeSliding)
                : initialParams.timeSliding

        initCarousel(el, slides, initialParams)
    }
}

/**
 * @typedef {Object} SlideRow
 * @property {string} src
 * @property {string} text
 */

/**
 * @typedef {Object} CarouselInitial
 * @property {number} width
 * @property {number} height
 * @property {boolean} withControl
 * @property {boolean} withIndicators
 * @property {number} timeView
 * @property {number} timeSliding
 */

/**
 * @typedef {Object} CarouselParams
 * @property {HTMLElement} parentElem
 * @property {number} timerNext
 * @property {boolean} isSliding
 * @property {number} nextByDirection
 * @property {number} nextByControl
 * @property {number} all
 * @property {number} currentIndex
 * @property {CarouselInitial} initial
 */

/**
 * @returns {CarouselInitial}
 * @param {CarouselInitial} data
 */
function initDefaultParams(data = {}) {
    data.width = data.width || 500
    data.height = data.height || 300
    data.withControl = !!data.withControl
    data.withIndicators = !!data.withIndicators
    data.timeView = data.timeView || 3000
    data.timeSliding = data.timeSliding || 1000
    return data
}

/**
 * @param {HTMLElement} parentElem
 * @param {[SlideRow]} slideRows
 * @param {CarouselInitial} initialParams
 * @returns {void |
 *   {
 *     appendSlide:(src: string, htmlText: string) => void,
 *     removeSlide:(index:number)=>void,
 *     updateSlide:(index:number, src: string, text: string)=>void,
 *     all:()=>number
 *   }
 * }
 */
export function initCarousel(parentElem, slideRows = [], initialParams = {}) {
    if (!slideRows.length) return

    initialParams = initDefaultParams(initialParams)
    initCarouselView(parentElem, slideRows, initialParams)
    const carouselParams = startCarousel(
        parentElem,
        slideRows.length,
        initialParams
    )

    return {
        /**
         * @param {string} src
         * @param {string} text
         */
        appendSlide(src, text) {
            const els = parentElem.getElementsByClassName(carouselInnerCss)
            if (els.length === 1) {
                const innerElem = els[0]
                const itemElem = document.createElement('div')
                itemElem.classList.add(carouselItemCss)
                itemElem.innerHTML = addItem({ src, text }, initialParams)
                innerElem.appendChild(itemElem)
                carouselParams.all =
                    parentElem.getElementsByClassName(carouselItemCss).length
                updateIndicators(carouselParams)
            }
        },
        /**
         * @returns {number}
         */
        all() {
            return carouselParams.all
        },
        /**
         * @param {number} index
         */
        removeSlide(index) {
            const elsItems = parentElem.getElementsByClassName(carouselItemCss)
            elsItems.item(index)?.remove()
            carouselParams.all =
                parentElem.getElementsByClassName(carouselItemCss).length
            updateIndicators(carouselParams)
        },
        /**
         * @param {number} index
         * @param {string} src
         * @param {string} text
         */
        updateSlide(index, src, text) {
            const els = parentElem.getElementsByClassName(carouselItemCss)
            if (els.item(index)) {
                els.item(index).innerHTML = addItem(
                    { src, text },
                    initialParams
                )
            }
        },
    }
}

/**
 * @param {SlideRow} row
 * @param {CarouselInitial} initialParams
 * @returns {string}
 */
function addItem(row, initialParams) {
    return `<div class="${carouselSlideCss}"><img src="${row.src}" width="${
        initialParams.width
    }" height="${initialParams.height}" alt="" />${
        row.text ? `<div class="${carouselTextCss}">${row.text}</div>` : ''
    }</div>`
}

/**
 * @param {CarouselParams} carouselParams
 */
function updateIndicators(carouselParams) {
    const elsIndicators = carouselParams.parentElem.getElementsByClassName(
        carouselIndicatorsCss
    )
    if (elsIndicators.length === 1) {
        elsIndicators.item(0).innerHTML = Array.from({
            length: carouselParams.all,
        })
            .map((_, index) => `<button data-index="${index}"></button>`)
            .join('')
    }
}

/**
 * @param {HTMLElement} parentElem
 * @param {[SlideRow]} slideRows
 * @param {CarouselInitial} initialParams
 */
function initCarouselView(parentElem, slideRows, initialParams) {
    const items = slideRows.map(
        (row) =>
            `<div class="${carouselItemCss}">${addItem(
                row,
                initialParams
            )}</div>`
    )

    const html = [`<div class="${carouselInnerCss}">${items.join('')}</div>`]
    if (initialParams.withControl) {
        html.push(
            `<button class="${carouselControlPrev}"></button>`,
            `<button class="${carouselControlNext}"></button>`
        )
    }
    if (initialParams.withIndicators) {
        html.push(`<div class="${carouselIndicatorsCss}"/>`)
    }

    parentElem.setAttribute(
        'style',
        `--sliding-time: ${initialParams.timeSliding}ms;`
    )
    parentElem.classList.add(carouselCss)
    parentElem.style.width = initialParams.width + 'px'
    parentElem.innerHTML = html.join('')
    parentElem
        .getElementsByClassName(carouselItemCss)[0]
        .classList.add(activeCss)
}

/**
 * @param {HTMLElement} parentElem
 * @param {number} all
 * @param {CarouselInitial} initialParams
 * @returns {CarouselParams}
 */
function startCarousel(parentElem, all, initialParams) {
    /**
     * @type {CarouselParams}
     */
    const carouselParams = {
        parentElem,
        timerNext: 0,
        isSliding: false,
        nextByDirection: directionOptions.none,
        nextByControl: byControlDefault,
        all,
        currentIndex: 0,
        initial: initialParams,
    }

    if (initialParams.withControl) {
        parentElem
            .getElementsByClassName(carouselControlPrev)[0]
            .addEventListener('click', () =>
                handleNextStep(carouselParams, directionOptions.prev)
            )
        parentElem
            .getElementsByClassName(carouselControlNext)[0]
            .addEventListener('click', () =>
                handleNextStep(carouselParams, directionOptions.next)
            )
    }
    if (initialParams.withIndicators) {
        updateIndicators(carouselParams)
        carouselParams.parentElem
            .getElementsByClassName(carouselIndicatorsCss)
            .item(0)
            .addEventListener('click', (e) =>
                handleIndicator(carouselParams, e.target)
            )
    }

    nextTimer(carouselParams)

    return carouselParams
}

/**
 * @param {CarouselParams} carouselParams
 */
function nextTimer(carouselParams) {
    clearTimeout(carouselParams.timerNext)
    carouselParams.timerNext = setTimeout(
        handleNextByTimer,
        carouselParams.initial.timeView,
        carouselParams
    )
}

/**
 * @param {CarouselParams} carouselParams
 */
function handleNextByTimer(carouselParams) {
    handleNextStep(carouselParams, directionOptions.next)
}

/**
 * @param {CarouselParams} carouselParams
 * @param {number} direction
 */
function handleNextStep(carouselParams, direction) {
    carouselParams.nextByDirection = direction
    startSliding(carouselParams)
}

/**
 * @param {CarouselParams} carouselParams
 * @param {HTMLElement} elem
 */
function handleIndicator(carouselParams, elem) {
    const index = Number(elem.dataset?.index)
    if (isNaN(index)) return
    carouselParams.nextByControl = index
    startSliding(carouselParams)
}

/**
 * @param {CarouselParams} carouselParams
 */
function startSliding(carouselParams) {
    if (carouselParams.isSliding) {
        return
    }

    let nextIndex =
        carouselParams.nextByControl > byControlDefault
            ? carouselParams.nextByControl
            : carouselParams.currentIndex + carouselParams.nextByDirection
    const isNext = nextIndex > carouselParams.currentIndex
    if (isNext) {
        nextIndex = nextIndex >= carouselParams.all ? 0 : nextIndex
    } else {
        nextIndex = nextIndex < 0 ? carouselParams.all - 1 : nextIndex
    }

    carouselParams.nextByControl = byControlDefault
    carouselParams.nextByDirection = directionOptions.none

    if (nextIndex === carouselParams.currentIndex) {
        nextTimer(carouselParams)
        return
    }

    carouselParams.isSliding = true
    clearTimeout(carouselParams.timerNext)

    /**
     * @type Array<HTMLElement>
     */
    const items = [
        ...carouselParams.parentElem.querySelectorAll(`.${carouselItemCss}`),
    ]
    const currentElement = items[carouselParams.currentIndex]
    const classListNext = items[nextIndex].classList

    const classElem = isNext ? carouselNextElemCss : carouselPrevElemCss
    const classAnim = isNext ? carouselNextAnimCss : carouselPrevAnimCss

    const classListCurrent = currentElement.classList
    classListNext.add(activeCss, classElem, classAnim)
    classListCurrent.add(classAnim)

    currentElement.addEventListener('animationend', transitionEnd)

    function transitionEnd() {
        carouselParams.isSliding = false
        carouselParams.currentIndex = nextIndex
        currentElement.removeEventListener('animationend', transitionEnd)
        classListCurrent.remove(activeCss, classAnim)
        classListNext.remove(classElem, classAnim)

        if (
            carouselParams.nextByControl !== byControlDefault ||
            carouselParams.nextByDirection !== directionOptions.none
        ) {
            // следующий если были события (также через таймер, но не долгий - для нормальной анимации должно прочти некоторое время после завершения)
            carouselParams.timerNext = setTimeout(
                startSliding,
                300,
                carouselParams
            )
        } else {
            // следующий по таймеру, если не было событий
            nextTimer(carouselParams)
        }
    }
}
