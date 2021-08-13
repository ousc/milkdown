import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Local, i18nConfig } from '../../route';
import { Mode } from '../constant';
import { editorModeCtx, isDarkModeCtx, setEditorModeCtx, setIsDarkModeCtx, setLocalCtx } from '../Context';
import { useEditorMode } from '../hooks/userEditorMode';
import { useRoot } from '../hooks/useRoot';
import className from './style.module.css';

const materialIcon = `${className.icon} material-icons-outlined`;

const LanguageList: React.FC<{ show: boolean; setShow: (show: boolean) => void }> = ({ show, setShow }) => {
    const root = useRoot();
    const setLocal = React.useContext(setLocalCtx);
    const history = useHistory();
    const location = useLocation();

    return !show ? null : (
        <ul
            className={className.langList}
            onClick={(e) => {
                e.stopPropagation();
                const { target } = e;
                if (!(target instanceof HTMLLIElement)) return;
                const { value, route } = target.dataset;
                if (!value) return;

                const path = location.pathname
                    .split('/')
                    .filter((x) => x)
                    .filter((x) => x !== root);
                setLocal(value as Local);
                setShow(false);
                const prefix = route;
                const next = [prefix, ...path].filter((x) => x).join('/');
                history.push('/' + next);
            }}
        >
            {Object.entries(i18nConfig).map(([key, { display, route }]) => (
                <li className={className.langItem} data-value={key} data-route={route} key={key}>
                    {display}
                </li>
            ))}
        </ul>
    );
};

export const Buttons: React.FC = () => {
    const editorMode = React.useContext(editorModeCtx);
    const isDarkMode = React.useContext(isDarkModeCtx);
    const setEditorMode = React.useContext(setEditorModeCtx);
    const setIsDarkMode = React.useContext(setIsDarkModeCtx);
    const showEditorToggle = useEditorMode();
    const [showLangList, setShowLangList] = React.useState(false);

    const onEditorModeToggle = () => setEditorMode((m) => (m === Mode.Default ? Mode.TwoSide : Mode.Default));

    React.useEffect(() => {
        const hideList = () => {
            setShowLangList(false);
        };
        const body = document.body;
        body.addEventListener('click', hideList);

        return () => {
            body.removeEventListener('click', hideList);
        };
    }, []);

    return (
        <div className={className.part}>
            {showEditorToggle && (
                <span onClick={() => onEditorModeToggle()} className={[materialIcon, className.mode].join(' ')}>
                    {editorMode === Mode.Default ? 'chrome_reader_mode' : 'wysiwyg'}
                </span>
            )}
            <div className={className.translate}>
                <span
                    className={materialIcon}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowLangList(true);
                    }}
                >
                    translate
                </span>
                <LanguageList show={showLangList} setShow={setShowLangList} />
            </div>
            <span onClick={() => setIsDarkMode(!isDarkMode)} className={materialIcon}>
                {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <a href="https://github.com/Saul-Mirone/milkdown" target="_blank" className={className.github}>
                <span className={materialIcon}>open_in_new</span>
            </a>
        </div>
    );
};
