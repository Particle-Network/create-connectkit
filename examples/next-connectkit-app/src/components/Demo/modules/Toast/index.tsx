import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import ReactDOM from 'react-dom';

import styles from  './index.module.css';
 
interface ToastProps {
	widthStyle?: any;
	contentText?: string | null;
	containerEl?: any;
}
 
export interface ToastType {
	show: (text: string) => void;
}
 
const Toast = forwardRef((props: ToastProps, ref: Ref<ToastType>): any => {
	const ToastRef: React.RefObject<HTMLDivElement> = useRef(null);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [fadeIn, setFadeIn] = useState<boolean>(false);
	const [contentText, setContentText] = useState<string>('');
 
	useImperativeHandle(ref, () => ({
		show: (text: string) => show(text),
	}));
 
	useEffect(() => {
		if (!showToast) return;
		const id = setTimeout(() => {
			setFadeIn(false);
		}, 2500);
		return () => clearTimeout(id);
	}, [showToast]);
 
	useEffect(() => {
		if (fadeIn || !showToast) return;
		const id = setTimeout(() => {
			setShowToast(false);
		}, 500);
		return () => clearTimeout(id);
	}, [fadeIn, showToast]);
 
	useEffect(() => {
		if (!('contentText' in props)) return;
		if (props.contentText) {
			setContentText(props.contentText || '');
			setFadeIn(true);
			setShowToast(true);
		} else if ('contentText' in props && props.contentText === null) {
			setFadeIn(false);
			setShowToast(false);
		}
	}, [props]);
 
	const show = (text: string) => {
		if (showToast) return;
		setContentText(text);
		setFadeIn(true);
		setShowToast(true);
	};
 
	return ReactDOM.createPortal(
		<div
			ref={ToastRef}
			className={`${styles.toast} ${fadeIn ? styles['fade-in'] : styles['fade-out']}`}
			style={{ display: showToast ? 'block' : 'none', ...props.widthStyle }}
		>
			<div className={styles['toast-inner']}>
				<div className={styles.content}>
          {contentText}
				</div>
			</div>
		</div>,
		props.containerEl || document.getElementById('wbContentContainer') || document.body,
	);
})
 
Toast.displayName = 'Toast';
export default Toast;