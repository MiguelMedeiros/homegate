"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import * as pubky from "@synonymdev/pubky";

const DEFAULT_HTTP_RELAY = "https://httprelay.staging.pubky.app/link/";
const TESTNET_HTTP_RELAY = "http://localhost:15412/link";

interface PubkyAuthWidgetProps {
  relay?: string;
  caps?: string;
  open?: boolean;
  testnet?: boolean;
  onSuccess?: (publicKey: string, session?: pubky.Session, token?: pubky.AuthToken) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function PubkyAuthWidget({
  relay,
  caps = "",
  open = false,
  testnet = false,
  onSuccess,
  onError,
  className = "",
}: PubkyAuthWidgetProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [showCopied, setShowCopied] = useState(false);
  const [pubkyZ32, setPubkyZ32] = useState<string>("");
  const [authUrl, setAuthUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sdkRef = useRef<pubky.Pubky | null>(null);

  // Initialize SDK
  useEffect(() => {
    sdkRef.current = testnet ? pubky.Pubky.testnet() : new pubky.Pubky();
  }, [testnet]);

  // Generate QR code
  const updateQr = useCallback(() => {
    if (!canvasRef.current || !authUrl) return;
    
    try {
      QRCode.toCanvas(canvasRef.current, authUrl, {
        margin: 2,
        scale: 8,
        color: { light: "#fff", dark: "#000" },
      });
    } catch (e) {
      console.error("QR render error:", e);
      onError?.(e as Error);
    }
  }, [authUrl, onError]);

  // Generate auth flow
  const generateFlow = useCallback(async () => {
    if (!sdkRef.current) return;

    setIsLoading(true);
    setPubkyZ32("");
    setAuthUrl("");

    try {
      const relayUrl = relay || (testnet ? TESTNET_HTTP_RELAY : DEFAULT_HTTP_RELAY);
      
      // Start the flow with the SDK's client
      const flow = sdkRef.current.startAuthFlow(caps as pubky.Capabilities, relayUrl);
      
      // Capture the deep link before awaiting
      const url = flow.authorizationUrl;
      setAuthUrl(url);

      // Update QR code
      updateQr();
      requestAnimationFrame(() => updateQr());

      // Wait for approval based on capabilities
      if (caps && caps.trim().length > 0) {
        // Capabilities requested -> wait for a Session
        const session = await flow.awaitApproval();
        const publicKey = session.info.publicKey.z32();
        setPubkyZ32(publicKey);
        onSuccess?.(publicKey, session);
      } else {
        // No capabilities -> wait for an AuthToken
        const token = await flow.awaitToken();
        const publicKey = token.publicKey.z32();
        setPubkyZ32(publicKey);
        onSuccess?.(publicKey, undefined, token);
      }
    } catch (error) {
      console.error("Auth flow failed:", error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [relay, caps, testnet, onSuccess, onError, updateQr]);

  // Toggle open state
  const toggleOpen = useCallback(() => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);

    if (newOpen && !authUrl) {
      generateFlow();
    } else if (!newOpen) {
      setPubkyZ32("");
      setAuthUrl("");
    }
  }, [isOpen, authUrl, generateFlow]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(authUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }, [authUrl]);

  // Update QR when authUrl changes
  useEffect(() => {
    updateQr();
  }, [updateQr]);

  const showSuccess = Boolean(pubkyZ32);
  const headerLabel = isOpen ? "Pubky Auth" : "Sign in with Pubky";

  const instruction = caps && caps.trim().length
    ? "Scan or copy Pubky auth URL"
    : "Scan to authenticate (no capabilities requested)";

  return (
    <div className={`pubky-auth-widget ${isOpen ? "open" : ""} ${className}`}>
      <button
        className="header"
        onClick={toggleOpen}
        aria-label="Open Pubky Auth"
        disabled={isLoading}
      >
        <div className="header-content">
          <svg
            id="pubky-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 452 690"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="m0.1 84.7l80.5 17.1 15.8-74.5 73.8 44.2 54.7-71.5 55.2 71.5 70.3-44.2 19.4 74.5 81.6-17.1-74.5 121.5c-40.5-35.3-93.5-56.6-151.4-56.6-57.8 0-110.7 21.3-151.2 56.4zm398.4 293.8c0 40.6-14 78-37.4 107.4l67 203.8h-403.1l66.2-202.3c-24.1-29.7-38.6-67.6-38.6-108.9 0-95.5 77.4-172.8 173-172.8 95.5 0 172.9 77.3 172.9 172.8zm-212.9 82.4l-48.2 147.3h178.1l-48.6-148 2.9-1.6c28.2-15.6 47.3-45.6 47.3-80.1 0-50.5-41-91.4-91.5-91.4-50.6 0-91.6 40.9-91.6 91.4 0 35 19.7 65.4 48.6 80.8z"
            />
          </svg>
          <span className="text">
            {isLoading ? "Loading..." : headerLabel}
          </span>
        </div>
      </button>

      <div className="line"></div>

      <div id="widget-content">
        {showSuccess ? (
          caps?.length ? (
            <div>
              <p>Successfully authorized:</p>
              <p className="pk">{pubkyZ32}</p>
              <p>With capabilities</p>
              {caps.split(",").map((cap, index) => (
                <p key={index}>{cap}</p>
              ))}
            </div>
          ) : (
            <div>
              <p>Successfully authenticated:</p>
              <p className="pk">{pubkyZ32}</p>
            </div>
          )
        ) : (
          <div>
            <p>{instruction}</p>
            <div className="card">
              <canvas ref={canvasRef} id="qr"></canvas>
            </div>
            <button
              className="card url"
              onClick={copyToClipboard}
              title="Copy URL"
            >
              <div className={`copied ${showCopied ? "show" : ""}`}>
                Copied to Clipboard
              </div>
              <p>{authUrl || ""}</p>
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="10" height="12" rx="2" fill="white"></rect>
                <rect
                  x="3"
                  y="3"
                  width="10"
                  height="12"
                  rx="2"
                  fill="white"
                  stroke="#3B3B3B"
                ></rect>
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .pubky-auth-widget {
          --full-width: 22rem;
          --full-height: 31rem;
          --header-height: 3.5rem;
          --closed-width: 14rem;
        }

        .pubky-auth-widget button {
          padding: 0;
          background: none;
          border: 0;
          color: inherit;
          cursor: pointer;
        }

        .pubky-auth-widget p {
          margin: 0;
        }

        .pubky-auth-widget {
          color: white;
          position: relative;
          overflow: hidden;
          background: rgba(43, 43, 43, 0.74);
          border: 1px solid #3c3c3c;
          box-shadow: 0 10px 34px -10px rgba(236, 243, 222, 0.05);
          border-radius: 999px;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          width: var(--closed-width);
          height: var(--header-height);
          transition: height 120ms ease, width 120ms ease, border-radius 120ms ease;
        }

        .pubky-auth-widget.open {
          width: var(--full-width);
          height: var(--full-height);
          border-radius: 12px;
        }

        .header {
          width: 100%;
          height: var(--header-height);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 0.9rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        #pubky-icon {
          height: 1.6rem;
          width: auto;
          fill: currentColor;
        }

        .text {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.2px;
        }

        .line {
          height: 1px;
          background-color: #3b3b3b;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        #widget-content {
          width: var(--full-width);
          padding: 0 1rem;
        }

        #widget-content p {
          font-size: 0.87rem;
          line-height: 1rem;
          text-align: center;
          color: #fff;
          opacity: 0.7;
          text-wrap: nowrap;
        }

        .pk {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
          opacity: 0.9;
        }

        #qr {
          width: 18em !important;
          height: 18em !important;
        }

        .card {
          position: relative;
          background: #3b3b3b;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card.url {
          padding: 0.625rem;
          justify-content: space-between;
          max-width: 100%;
        }

        .card.url p {
          display: flex;
          align-items: center;
          line-height: 1 !important;
          width: 93%;
          overflow: hidden;
          text-overflow: ellipsis;
          text-wrap: nowrap;
        }

        .copied {
          transition: opacity 80ms ease-in;
          opacity: 0;
          position: absolute;
          right: 0;
          top: -1.6rem;
          font-size: 0.9em;
          background: rgb(43 43 43 / 98%);
          padding: 0.5rem;
          border-radius: 0.3rem;
          color: #ddd;
        }

        .copied.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
