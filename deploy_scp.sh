#!/bin/sh

scp dist/casedata/* $CASEDATA_DEPLOY_USER@$CASEDATA_DEPLOY_HOST:$CASEDATA_DEPLOY_DIR
