import React, { useState, useRef } from "react"
import {
  Highlight,
  Preview,
  PreviewComponent,
  Source,
} from "../../../base-components/PreviewComponent"
import { FormSwitch } from "../../../base-components/Form"
import Button from "../../../base-components/Button"
import { Dialog } from "../../../base-components/Headless"
import Lucide from "../../../base-components/Lucide"

const ModalVerification = ({ onClick }: { onClick: Function }) => {
  const [deleteModalPreview, setDeleteModalPreview] = useState(false)
  const deleteButtonRef = useRef(null)
  return (
    <div>
      <PreviewComponent>
        <div className="p-5">
          <Preview>
            {/* BEGIN: Modal Toggle */}
            <div className="text-center">
              <Button
                as="a"
                href="#"
                variant="secondary"
                className="mr-2 ml-5 mt-5 text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault()
                  setDeleteModalPreview(true)
                }}
              >
                Notificar
              </Button>
            </div>
            {/* END: Modal Toggle */}
            {/* BEGIN: Modal Content */}
            <Dialog
              open={deleteModalPreview}
              onClose={() => {
                setDeleteModalPreview(false)
              }}
              initialFocus={deleteButtonRef}
            >
              <Dialog.Panel>
                <div className="p-5 text-center">
                  <Lucide
                    icon="BellRing"
                    className="w-16 h-16 mx-auto mt-3 text-info"
                  />
                  <div className="mt-5 text-3xl">
                    Estás a punto de enviar notificaciones
                  </div>
                  <div className="mt-2 text-slate-500">¿Deseas continuar?</div>
                </div>
                <div className="px-5 pb-8 text-center">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                      setDeleteModalPreview(false)
                    }}
                    className="mr-1 h-10"
                  >
                    Volver Atrás
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-24 h-10 mr-2 ml-5 mt-5 text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary"
                    ref={deleteButtonRef}
                    onClick={() => {
                      onClick()
                      setDeleteModalPreview(false)
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
          </Preview>
          <Source>
            <Highlight>
              {`
                {/* BEGIN: Modal Toggle */}
                <div className="text-center">
                  <Button
                    as="a"
                    href="#"
                    variant="primary"
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setDeleteModalPreview(true);
                    }}
                  >
                    Show Modal
                  </Button>
                </div>
                {/* END: Modal Toggle */}
                {/* BEGIN: Modal Content */}
                <Dialog
                  open={deleteModalPreview}
                  onClose={() => {
                    setDeleteModalPreview(false);
                  }}
                  initialFocus={deleteButtonRef}
                >
                  <Dialog.Panel>
                    <div className="p-5 text-center">
                      <Lucide
                        icon="XCircle"
                        className="w-16 h-16 mx-auto mt-3 text-danger"
                      />
                      <div className="mt-5 text-3xl">Are you sure?</div>
                      <div className="mt-2 text-slate-500">
                        Do you really want to delete these records? <br />
                        This process cannot be undone.
                      </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => {
                          setDeleteModalPreview(false);
                        }}
                        className="w-24 mr-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="w-24"
                        ref={deleteButtonRef}
                      >
                        Delete
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog>
                {/* END: Modal Content */}
                `}
            </Highlight>
          </Source>
        </div>
      </PreviewComponent>
    </div>
  )
}

export default ModalVerification
